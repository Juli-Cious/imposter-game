import Phaser from 'phaser';
import { FirebaseAdapter } from '../../networking/FirebaseAdapter';
import { useGameStore } from '../../../stores/useGameStore';
import type { NetworkService, PlayerState } from '../../networking/NetworkInterface';
import { MapBuilder } from '../MapBuilder';
import { useMeetingStore } from '../../../stores/useMeetingStore';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private network!: NetworkService;
  private myPlayerId: string | null = null;
  private currentZone: string | null = null;
  private wallLayer!: Phaser.Tilemaps.TilemapLayer;
  private doorTiles: { x: number, y: number }[] = [];
  private dbZone!: Phaser.GameObjects.Rectangle;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    M: Phaser.Input.Keyboard.Key; // Debug: Meeting
  };
  private logicZone!: Phaser.GameObjects.Rectangle;
  private hubZone!: Phaser.GameObjects.Rectangle;
  private bgm!: Phaser.Sound.BaseSound;
  private meetingBgm!: Phaser.Sound.BaseSound;
  private footsteps!: Phaser.Sound.BaseSound;

  private zoneTimer: number = 0;
  private pendingZoneId: string | null = null;
  private zoneProgressBar!: Phaser.GameObjects.Graphics;

  private meetingButton!: Phaser.GameObjects.Arc;
  private meetingText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load as spritesheets! (assuming 24x24 frames)
    this.load.spritesheet('doux', 'assets/sprites/DinoSprites - doux.png', { frameWidth: 24, frameHeight: 24 });
    this.load.spritesheet('mort', 'assets/sprites/DinoSprites - mort.png', { frameWidth: 24, frameHeight: 24 });
    this.load.spritesheet('tard', 'assets/sprites/DinoSprites - tard.png', { frameWidth: 24, frameHeight: 24 });
    this.load.spritesheet('vita', 'assets/sprites/DinoSprites - vita.png', { frameWidth: 24, frameHeight: 24 });
    this.load.image('tiles', 'assets/tilesets/scifi.png');
    this.load.image('terminal', 'assets/objects/small terminal.png');
    this.load.image('table', 'assets/objects/large_round_table.png');
    this.load.image('background', 'assets/background/bg.png'); // Preload background

    // Audio
    this.load.audio('bgm', 'assets/sounds/music/background.ogg');
    this.load.audio('meeting_bgm', 'assets/sounds/music/meeting_background_music.wav');
    this.load.audio('footsteps', 'assets/sounds/sfx/walking.mp3');

    this.load.on('filecomplete', (key: string) => {
      console.log(`Loaded: ${key}`);
    });
    this.load.on('loaderror', (file: any) => {
      console.warn(`Error loading: ${file.key} from ${file.url}`);
    });
  }

  create() {
    // 0. Set Texture Filter to Nearest (for Pixel Art)
    this.textures.get('tiles').setFilter(Phaser.Textures.FilterMode.NEAREST);
    ['doux', 'mort', 'tard', 'vita'].forEach(key => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

    // 0.5 Add Background (Tiled)
    // Make it large enough to cover the map. Map is roughly 25x25 tiles = 1600x1600.
    // Let's make a large tileSprite that scrolls slightly or is just static.
    this.add.tileSprite(0, 0, 3200, 3200, 'background')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0.5) // Parallax effect
      .setDepth(-10) // Behind everything
      .setPipeline('Light2D'); // Reacts to light? Maybe not if it's space. Let's start without pipeline for space.

    // Actually space should probably be dark and not lit by room lights? 
    // If we want it to be outside the station, it shouldn't be affected by Light2D usually, 
    // or it should be ambiently lit. Let's stick to no pipeline for now so it's visible.

    // 1. Initialize Network
    const { network, roomCode, playerId, playerName } = useGameStore.getState();

    if (network && roomCode && playerId) {
      // Production: Use existing connection passed from Menu/Lobby
      this.network = network;
      this.myPlayerId = playerId;
      console.log(`[MainScene] Reusing Network: Room ${roomCode}, Player ${playerId}`);
    } else if (roomCode && playerId && playerName) {
      // Re-connect using existing credentials (e.g. after refresh if state persisted, or race condition)
      console.warn('[MainScene] Network object missing but credentials exist. Reconnecting...');
      this.network = new FirebaseAdapter();
      useGameStore.getState().setNetwork(this.network);
      this.network.connect(roomCode, playerName).then(() => {
        this.myPlayerId = playerId;
        console.log(`[MainScene] Reconnected to ${roomCode}`);
      });
    } else {
      // Fallback / Dev Mode
      console.warn('[MainScene] Network/Credentials missing! Creating fresh connection (DEV MODE).');
      this.network = new FirebaseAdapter();
      useGameStore.getState().setNetwork(this.network);

      const devCode = 'DEV';
      this.network.connect(devCode, 'DevPlayer').then((id) => {
        this.myPlayerId = id;
        useGameStore.getState().setPlayerId(id);
        useGameStore.getState().setRoomCode(devCode);
        useGameStore.getState().setPlayerName('DevPlayer');
      });
    }

    // Audio Setup
    if (this.cache.audio.exists('bgm')) {
      this.bgm = this.sound.add('bgm', { loop: true, volume: useGameStore.getState().bgmVolume });
      this.bgm.play();
    }

    if (this.cache.audio.exists('meeting_bgm')) {
      this.meetingBgm = this.sound.add('meeting_bgm', { loop: true, volume: useGameStore.getState().bgmVolume });
    }

    if (this.cache.audio.exists('footsteps')) {
      this.footsteps = this.sound.add('footsteps', { loop: true, volume: useGameStore.getState().sfxVolume });
    } else {
      console.warn('Footsteps audio not found in cache!');
    }

    // Subscribe to Volume Changes
    useGameStore.subscribe((state) => {
      if (this.bgm && 'setVolume' in this.bgm) (this.bgm as any).setVolume(state.bgmVolume);
      if (this.meetingBgm && 'setVolume' in this.meetingBgm) (this.meetingBgm as any).setVolume(state.bgmVolume);
      if (this.footsteps && 'setVolume' in this.footsteps) (this.footsteps as any).setVolume(state.sfxVolume);
    });

    // Subscribe to Meeting State
    let prevStatus = 'IDLE';
    this.network.subscribeToMeeting((state) => {
      // Update Store
      useMeetingStore.getState().setMeetingState(state);

      // React to State Changes
      if (prevStatus === 'IDLE' && state.status === 'DISCUSSION') {
        this.startMeeting();
      } else if (prevStatus === 'DISCUSSION' && state.status === 'IDLE') {
        this.endMeeting();
      }
      prevStatus = state.status;
    });

    // Subscribe to Chat
    this.network.subscribeToChat((messages) => {
      useMeetingStore.getState().setMeetingState({ chatMessages: messages });
    });

    // Enable Lights
    this.lights.enable();
    this.lights.setAmbientColor(0x808080); // Increased from 0x101010 to 0x808080 (much brighter)

    // Progress Bar
    this.zoneProgressBar = this.add.graphics();
    this.zoneProgressBar.setDepth(100); // UI layer above players

    // Meeting Button (Main Room - near spawn)
    // Aligned to Grid (6.5, 3.5) -> (416, 224)
    // Outer darker red circle (border/base)
    this.meetingButton = this.add.circle(416, 224, 25, 0x990000).setDepth(5).setPipeline('Light2D');
    this.physics.add.existing(this.meetingButton, true); // Static body

    // Inner bright red button
    this.add.circle(416, 224, 20, 0xff0000).setDepth(5).setPipeline('Light2D');

    // Text Label nearby
    this.meetingText = this.add.text(416, 184, "Press 'M' for Meeting", {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 },
      resolution: 3
    }).setOrigin(0.5).setVisible(false).setDepth(100);

    // 2. Build Map
    // 2. Build Map
    const mapBuilder = new MapBuilder(this);
    const buildResult = mapBuilder.build();
    const { walls, dbZone, apiZone, hubZone, meetingZone, doorTiles, spawnPoint } = buildResult;

    // We know 'walls' is a TilemapLayer in this context, but TS infers union with StaticGroup
    this.wallLayer = walls as Phaser.Tilemaps.TilemapLayer;
    this.doorTiles = doorTiles || []; // Ensure array if undefined

    // Assign zones & Add Terminals
    // Terminals depth 1: Above ground (0), below player (default sorting or higher)
    if (dbZone) {
      this.dbZone = dbZone;
      this.add.image(dbZone.x, dbZone.y, 'terminal').setDepth(1).setOrigin(0.5, 0.5).setPipeline('Light2D');
    }
    if (apiZone) {
      this.logicZone = apiZone;
      this.add.image(apiZone.x, apiZone.y, 'terminal').setDepth(1).setOrigin(0.5, 0.5).setPipeline('Light2D');
    }
    if (hubZone) {
      this.hubZone = hubZone;
      this.add.image(hubZone.x, hubZone.y, 'terminal').setDepth(1).setOrigin(0.5, 0.5).setPipeline('Light2D');
    }

    // Meeting Room Table
    if (meetingZone) {
      this.add.image(meetingZone.x, meetingZone.y, 'table').setDepth(1).setOrigin(0.5, 0.5).setPipeline('Light2D');
    }

    // 3. Define Animations (Global)
    // Idle: Frames 0-3 (0, 1, 2, 3)
    // Walk: Frames 4-9 (4, 5, 6, 7, 8, 9)
    const dinos = ['doux', 'mort', 'tard', 'vita'];
    dinos.forEach(dino => {
      this.anims.create({
        key: `${dino}-idle`,
        frames: this.anims.generateFrameNumbers(dino, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${dino}-move`,
        frames: this.anims.generateFrameNumbers(dino, { start: 4, end: 9 }),
        frameRate: 10,
        repeat: -1
      });
    });

    // 4. Create "Me" (Doux) - CUSTOMIZED
    const startX = spawnPoint ? spawnPoint.x : 400;
    const startY = spawnPoint ? spawnPoint.y : 300;
    const { playerSkin, playerTint } = useGameStore.getState();
    const mySkin = playerSkin || 'doux';

    this.player = this.physics.add.sprite(startX, startY, mySkin);
    this.player.setScale(2);
    // Adjust collision box to be smaller and centered on feet
    this.player.setSize(14, 14);
    this.player.setOffset(5, 10);
    this.player.play(`${mySkin}-idle`);

    // Apply Tint if not white
    if (playerTint !== 0xffffff) {
      this.player.setTint(playerTint);
    }

    // Add Name Tag for Self
    // Add Name Tag for Self
    const myNameTag = this.add.text(startX, startY - 20, useGameStore.getState().playerName || 'Me', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffff00', // Yellow for self
      stroke: '#000000',
      strokeThickness: 3,
      resolution: 2,
      padding: { x: 10, y: 10 } // Fix cutoff
    }).setOrigin(0.5);

    // Track it manually (No setData needed for local update loop variable, but consistent with others)
    this.player.setData('nameTag', myNameTag);

    // FIX JITTER: Update position in postUpdate (after physics)
    this.events.on('postupdate', () => {
      if (this.player && myNameTag.active) {
        // Round to integer to match pixel art style if needed, or raw for smooth
        // Since roundPixels is true, we can just pass raw.
        myNameTag.setPosition(this.player.x, this.player.y - 20);
      }
    });

    // Enable Light for Player
    this.player.setPipeline('Light2D');

    // Camera Follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.5);

    // Collision with walls
    this.physics.add.collider(this.player, walls);

    // 5. Create Input Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,S,A,D,M') as any;

      // Stop Phaser from capturing these keys so they bubble up to the DOM (Code Editor)
      this.input.keyboard.removeCapture('W,A,S,D,M,UP,DOWN,LEFT,RIGHT,SPACE');
    }

    // 6. Handle Other Players
    this.network.subscribeToPlayers((players: PlayerState[]) => {
      this.updateOtherPlayers(players);
    });

    // 7. Cleanup
    this.events.on('destroy', () => {
      if (this.network) this.network.disconnect();
      if (this.bgm) this.bgm.stop();
      if (this.meetingBgm) this.meetingBgm.stop();
      if (this.footsteps) this.footsteps.stop();
    });

    // Add Atmospheric Lights
    // Removed as per request (replaced by uniform ceiling lights)
  }

  update(_time: number, delta: number) {
    if (!this.cursors || !this.player) return;

    const speed = 160;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const prevVelocity = body.velocity.clone();

    // Prevent movement if Editor is open or typing
    const { activeFileId } = useGameStore.getState();
    if (activeFileId || (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA'))) {
      body.setVelocity(0);
      this.player.play('doux-idle', true);
      if (this.footsteps && this.footsteps.isPlaying) this.footsteps.stop();
      return;
    }

    // Name Tag update moved to postupdate to fix jitter

    body.setVelocity(0); // Reset velocity every frame

    let isMoving = false;

    // Movement Logic
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    if (left) {
      body.setVelocityX(-speed);
      this.player.setFlipX(true);
      isMoving = true;
    } else if (right) {
      body.setVelocityX(speed);
      this.player.setFlipX(false);
      isMoving = true;
    }

    if (up) {
      body.setVelocityY(-speed);
      isMoving = true;
    } else if (down) {
      body.setVelocityY(speed);
      isMoving = true;
    }

    // Animation Logic
    const { playerSkin } = useGameStore.getState();
    const mySkin = playerSkin || 'doux';

    if (isMoving) {
      this.player.play(`${mySkin}-move`, true);
      if (this.footsteps && !this.footsteps.isPlaying) {
        this.footsteps.play();
      }
    } else {
      this.player.play(`${mySkin}-idle`, true);
      if (this.footsteps && this.footsteps.isPlaying) {
        this.footsteps.stop();
      }
    }

    // Send to Firebase if moved
    if ((body.velocity.x !== 0 || body.velocity.y !== 0) && this.myPlayerId) {
      this.network.sendPlayerMove(this.player.x, this.player.y);
    }

    // Update Light Position
    // Player light removed

    // Zone Interaction
    const { openEditor, closeTerminal } = useGameStore.getState();
    const inDbZone = this.physics.overlap(this.player, this.dbZone);
    const inLogicZone = this.physics.overlap(this.player, this.logicZone);
    const inHubZone = this.physics.overlap(this.player, this.hubZone);

    let activeZoneId: string | null = null;
    if (inDbZone) activeZoneId = 'file_sum';
    else if (inLogicZone) activeZoneId = 'file_loop';
    else if (inHubZone) activeZoneId = 'file_cpp_hello';

    // 1. If we are in a zone, but it's not the "current" (open) one
    if (activeZoneId && activeZoneId !== this.currentZone) {
      // If we were tracking a different zone, reset
      if (this.pendingZoneId !== activeZoneId) {
        this.pendingZoneId = activeZoneId;
        this.zoneTimer = 0;
      }

      // Increment Timer
      this.zoneTimer += delta;

      // Draw Progress Bar
      const progress = Math.min(this.zoneTimer / 700, 1);
      this.zoneProgressBar.clear();
      this.zoneProgressBar.fillStyle(0x000000, 0.5);
      this.zoneProgressBar.fillRect(this.player.x - 20, this.player.y + 20, 40, 6);
      this.zoneProgressBar.fillStyle(0x00ffff, 1);
      this.zoneProgressBar.fillRect(this.player.x - 20, this.player.y + 20, 40 * progress, 6);

      // Threshold Reached?
      if (this.zoneTimer >= 700) {
        this.currentZone = activeZoneId;
        openEditor(activeZoneId);
        this.zoneProgressBar.clear();
        this.zoneTimer = 0;
        this.pendingZoneId = null;
      }
    }
    // 2. If we left the zone or are in the current zone
    else {
      // If we are NOT in the active zone anymore, but we thought we were
      if (!activeZoneId && this.currentZone) {
        closeTerminal();
        this.currentZone = null;
      }

      // Reset timer if we just ran through or left
      if (!activeZoneId || activeZoneId === this.currentZone) {
        this.zoneTimer = 0;
        this.pendingZoneId = null;
        this.zoneProgressBar.clear();
      }
    }

    // Debug: Call Meeting checks (Now strictly button based)
    // Distance check
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.meetingButton.x, this.meetingButton.y);
    if (dist < 50) {
      this.meetingText.setVisible(true);
      if (this.wasd.M && Phaser.Input.Keyboard.JustDown(this.wasd.M)) {
        if (this.myPlayerId) {
          this.network.startMeeting(this.myPlayerId);
        }
      }
    } else {
      this.meetingText.setVisible(false);
    }
  }

  // --- Meeting Logic ---
  public startMeeting() {
    // Teleport to Meeting Room (Center approx: 19, 12)
    // TILE_SIZE = 64. 19*64=1216, 12*64=768
    this.player.setPosition(1216, 768);
    // Force network update immediately
    if (this.myPlayerId) {
      this.network.sendPlayerMove(1216, 768);
    }

    // Audio Swap
    // Audio Swap
    if (this.bgm) this.bgm.pause();
    if (this.meetingBgm) {
      this.meetingBgm.play({
        loop: true,
        volume: useGameStore.getState().bgmVolume
      });
    }

    // Close Door
    this.toggleDoor(false);
  }

  public endMeeting() {
    // Teleport back to Spawn or Hub
    this.player.setPosition(400, 300);
    // Force network update immediately
    if (this.myPlayerId) {
      this.network.sendPlayerMove(400, 300);
    }

    // Audio Swap
    if (this.meetingBgm) this.meetingBgm.stop();
    if (this.bgm) this.bgm.resume();

    // Open Door
    this.toggleDoor(true);
  }

  public toggleDoor(isOpen: boolean) {
    this.doorTiles.forEach(pos => {
      const tile = this.wallLayer.getTileAt(pos.x, pos.y);
      if (tile) {
        // If Open: No Collision, Invisible
        // If Closed: Collision, Visible
        tile.setCollision(!isOpen);
        tile.setVisible(!isOpen);
      }
    });
  }

  // Helper to draw/update other people
  private updateOtherPlayers(players: PlayerState[]) {
    if (!this.myPlayerId) return;

    const activeIds = new Set(players.map(p => p.id));

    players.forEach((p) => {
      if (p.id === this.myPlayerId) return;

      if (this.otherPlayers.has(p.id)) {
        const other = this.otherPlayers.get(p.id);
        if (other) {
          const oldX = other.x;
          other.x = p.x;
          other.y = p.y;

          const nameTag = other.getData('nameTag');
          if (nameTag) {
            nameTag.setPosition(p.x, p.y - 30);
          }

          // Simple animation for remote players
          const dx = p.x - oldX;
          if (dx < 0) other.setFlipX(true);
          else if (dx > 0) other.setFlipX(false);

          // Note: We can't easily detect "moving" without prev position history or sending velocity.
          // For now, just play idle or move based on position change? 
          // Better: just play 'idle' for now or simple check.
          // Let's assume they are "idle" if we don't know velocity.
          // Actually, let's just make them play their animation based on skin.
          const bgmVol = useGameStore.getState().bgmVolume; // unused variable but keeps hook consistent if needed later
          // Check online status
          const isOnline = p.isOnline !== false; // Default to true if undefined
          other.setVisible(isOnline);
          const tagName = other.getData('nameTag');
          if (tagName) {
            tagName.setVisible(isOnline);
          }

          if (isOnline) {
            const skin = other.getData('skin');
            // If skin changed remotely (unlikely but possible), we might need to update texture
            // For now assume skin is constant per session, but we can check:
            if (p.skin && p.skin !== skin) {
              other.setTexture(p.skin);
              other.setData('skin', p.skin);
            }

            // Update Tint
            if (p.tint !== undefined) {
              other.setTint(p.tint);
            }

            other.play(`${other.getData('skin')}-idle`, true);
          }
        }
      } else {
        // NEW PLAYER
        const skin = p.skin || 'doux'; // Default to doux if missing

        const newPlayer = this.add.sprite(p.x, p.y, skin);
        newPlayer.setData('skin', skin);
        newPlayer.setScale(2);
        newPlayer.play(`${skin}-idle`);
        newPlayer.setPipeline('Light2D');

        if (p.tint !== undefined && p.tint !== 0xffffff) {
          newPlayer.setTint(p.tint);
        }

        // Add Name Tag
        const nameTag = this.add.text(p.x, p.y - 20, p.name || 'Unknown', {
          fontSize: '12px',
          fontFamily: 'Arial',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
          resolution: 2,
          padding: { x: 10, y: 10 }
        }).setOrigin(0.5);

        // Store both as a custom object or just attach text to sprite data
        newPlayer.setData('nameTag', nameTag);

        this.otherPlayers.set(p.id, newPlayer);
      }
    });

    this.otherPlayers.forEach((sprite, id) => {
      if (!activeIds.has(id)) {
        sprite.getData('nameTag')?.destroy();
        sprite.destroy();
        this.otherPlayers.delete(id);
      }
    });
  }
}