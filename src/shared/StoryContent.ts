/**
 * Complete story script for intro and victory animations
 */

export interface StoryScene {
    id: string;
    duration: number; // milliseconds
    background: string; // CSS gradient or color
    visual: string; // Emoji visualization
    text: string;
    narration?: string;
    animation?: string;
}

export const INTRO_SCENES: StoryScene[] = [
    {
        id: 'earth-beautiful',
        duration: 2500,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        visual: '🌍✨🌟',
        text: 'Once upon a time, Planet Earth was a beautiful paradise...',
        narration: 'A world full of life, energy, and wonder.',
        animation: 'fade-in'
    },
    {
        id: 'crisis-pollution',
        duration: 2500,
        background: 'linear-gradient(135deg, #57534e 0%, #292524 100%)',
        visual: '☁️🏭💨😷',
        text: 'But then... dark clouds of pollution began to spread.',
        narration: 'Factories pumped smoke. The air became toxic.',
        animation: 'darken'
    },
    {
        id: 'crisis-energy',
        duration: 2500,
        background: 'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
        visual: '🔌💔🌃',
        text: 'Cities ran out of clean energy. Lights went dark.',
        narration: 'Without power, schools closed. Hospitals struggled.',
        animation: 'lights-out'
    },
    {
        id: 'crisis-waste',
        duration: 2500,
        background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
        visual: '🗑️🌊🐋😢',
        text: 'Mountains of waste filled oceans. Animals suffered.',
        narration: 'Plastic everywhere. Nature was dying.',
        animation: 'waves'
    },
    {
        id: 'earth-crying',
        duration: 2000,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        visual: '🌍😢💔',
        text: 'Earth cried out for help...',
        narration: 'The planet was in danger. Time was running out.',
        animation: 'shake'
    },
    {
        id: 'guardian-appears',
        duration: 2500,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
        visual: '✨🧙‍♀️✨',
        text: 'Then, the Ancient Guardian appeared from the stars...',
        narration: 'Professor Gaia, protector of Earth.',
        animation: 'sparkle'
    },
    {
        id: 'call-to-action',
        duration: 2500,
        background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        visual: '🌟👤🌟',
        text: 'She searched the world for someone special...',
        narration: 'Someone with the potential to become a hero.',
        animation: 'search'
    },
    {
        id: 'chosen-one',
        duration: 3000,
        background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
        visual: '⚡YOU⚡',
        text: 'And she found YOU! You have been CHOSEN!',
        narration: 'You possess incredible potential!',
        animation: 'glow'
    },
    {
        id: 'powers-reveal',
        duration: 3000,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        visual: '⚡♻️💨',
        text: 'Three powerful abilities await you...',
        narration: 'Solar Energy ⚡ | Recycling ♻️ | Air Quality 💨',
        animation: 'float'
    },
    {
        id: 'training-needed',
        duration: 2500,
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        visual: '📚🚀🎯',
        text: 'But first, you must learn to master your powers!',
        narration: 'Every hero needs training...',
        animation: 'pulse'
    },
    {
        id: 'space-station',
        duration: 3000,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        visual: '🛸✨🌟',
        text: 'Welcome to your Space Station training facility!',
        narration: 'Here you will become Earth\'s greatest defender!',
        animation: 'zoom-in'
    },
    {
        id: 'mission-briefing',
        duration: 3000,
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        visual: '📚➡️🎯',
        text: 'Visit ACADEMIES to learn. Solve CHALLENGES to save Earth!',
        narration: 'The fate of our planet is in your hands!',
        animation: 'slide'
    },
    {
        id: 'call-to-adventure',
        duration: 3000,
        background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
        visual: '🦸‍♀️🌍💪',
        text: 'Are you ready to become Earth\'s Guardian?',
        narration: 'Your adventure begins NOW!',
        animation: 'bounce'
    }
];

export const VICTORY_SCENES: StoryScene[] = [
    {
        id: 'powers-complete',
        duration: 3500,
        background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
        visual: '⚡♻️💨',
        text: 'You have mastered ALL THREE powers!',
        narration: 'Solar Energy! Recycling! Air Quality!',
        animation: 'combine'
    },
    {
        id: 'earth-healing-start',
        duration: 3000,
        background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
        visual: '🌍✨💫',
        text: 'Watch as your powers begin to heal the Earth!',
        narration: 'The planet responds to your efforts...',
        animation: 'glow'
    },
    {
        id: 'solar-impact',
        duration: 3500,
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        visual: '☀️🔆⚡🏙️',
        text: 'Solar panels light up cities around the world!',
        narration: 'Clean energy powers every home and school!',
        animation: 'lights-on'
    },
    {
        id: 'recycling-impact',
        duration: 3500,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        visual: '♻️🌊🐋🌈',
        text: 'Oceans become clean! Marine life thrives again!',
        narration: 'Recycling saves countless animals!',
        animation: 'waves-clean'
    },
    {
        id: 'air-impact',
        duration: 3500,
        background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        visual: '💨🌈🦋🌸',
        text: 'The air becomes pure and fresh!',
        narration: 'People breathe freely. Nature flourishes!',
        animation: 'wind'
    },
    {
        id: 'earth-healed',
        duration: 4000,
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        visual: '🌍💚✨🎉',
        text: 'Earth is SAVED! The world is beautiful again!',
        narration: 'Trees grow. Animals play. Cities shine!',
        animation: 'bloom'
    },
    {
        id: 'celebration',
        duration: 4500,
        background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
        visual: '🎉🎊🏆🌟',
        text: 'YOU DID IT! You saved the entire world!',
        narration: 'You are Earth\'s Guardian! A true hero!',
        animation: 'confetti'
    },
    {
        id: 'guardian-thanks',
        duration: 4000,
        background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        visual: '🧙‍♀️💖👤',
        text: 'Professor Gaia: "I knew you were special!"',
        narration: 'Thank you, brave hero, for saving our home.',
        animation: 'embrace'
    },
    {
        id: 'ongoing-mission',
        duration: 4000,
        background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
        visual: '🌍🛡️💪',
        text: 'But remember: Earth needs protecting every day...',
        narration: 'Keep learning. Keep coding. Keep Earth healthy!',
        animation: 'float'
    },
    {
        id: 'real-world-call',
        duration: 4500,
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        visual: '♻️🌳💚',
        text: 'In the real world, YOU can help too!',
        narration: 'Recycle. Save energy. Protect nature. Code for good!',
        animation: 'pulse'
    }
];

export interface TutorialStep {
    id: string;
    target: string; // Element ID or class to highlight
    position: 'top' | 'right' | 'bottom' | 'left' | 'center';
    title: string;
    description: string;
    highlight: boolean;
    arrow?: boolean;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: 'game-canvas',
        position: 'center',
        title: 'Welcome to Your Space Station! 🚀',
        description: 'This is your training facility where you\'ll learn your coding powers to save Earth!',
        highlight: false,
        arrow: false
    },
    {
        id: 'academies',
        target: 'academy-stations',
        position: 'right',
        title: 'ACADEMY Stations 📚',
        description: 'Click these glowing stations to LEARN your powers! Visit them first to unlock your abilities.',
        highlight: true,
        arrow: true
    },
    {
        id: 'challenges',
        target: 'challenge-stations',
        position: 'right',
        title: 'CHALLENGE Stations 🎯',
        description: 'After learning, come here to TEST your powers and help save Earth!',
        highlight: true,
        arrow: true
    },
    {
        id: 'hint-system',
        target: 'hint-button',
        position: 'bottom',
        title: 'Need Help? Ask Professor Gaia! 💡',
        description: 'Stuck? Click "Need Help?" to chat with your AI Mentor anytime!',
        highlight: true,
        arrow: false
    },
    {
        id: 'sdg-badges',
        target: 'sdg-badges',
        position: 'bottom',
        title: 'UN Sustainable Development Goals 🌍',
        description: 'These badges show which global goals you\'re helping achieve!',
        highlight: true,
        arrow: false
    },
    {
        id: 'start-journey',
        target: 'academy-solar',
        position: 'right',
        title: 'Start Your Journey! ⚡',
        description: 'Begin with the Solar Academy →  Learn addition to power cities with clean energy!',
        highlight: true,
        arrow: true
    }
];
