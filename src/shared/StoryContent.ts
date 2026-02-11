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
        id: 'virus-alert',
        duration: 3500,
        background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
        visual: '🦠💻🚨',
        text: 'ALERT! A mysterious virus is attacking Earth\'s environmental systems!',
        narration: 'The planet\'s defenses are failing!',
        animation: 'shake'
    },
    {
        id: 'guardian-calls',
        duration: 3500,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
        visual: '✨🧙‍♀️🌍',
        text: 'Professor Gaia calls upon brave CODERS to fix the systems and save Earth!',
        narration: 'Young heroes answer the call!',
        animation: 'sparkle'
    },
    {
        id: 'imposter-warning',
        duration: 4500,
        background: 'linear-gradient(135deg, #7c2d12 0%, #1c1917 100%)',
        visual: '🕵️❓🎭',
        text: 'But BEWARE! One coder among you is secretly a SABOTEUR!',
        narration: 'Someone is trying to stop you from saving the planet...',
        animation: 'shake'
    },
    {
        id: 'dual-mission',
        duration: 4000,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        visual: '🦸‍♀️🔍💻',
        text: 'HEROES: Fix the code, complete challenges, find the saboteur! SABOTEUR: Stay hidden!',
        narration: 'Work together... but trust carefully!',
        animation: 'pulse'
    },
    {
        id: 'adventure-begins',
        duration: 4000,
        background: 'linear-gradient(135deg, #3b82f6 0%, #f59e0b 100%)',
        visual: '🎉🚀🌍',
        text: 'Are you ready to solve this mystery and save the world?',
        narration: 'The detective adventure begins NOW!',
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
        title: 'Welcome to the Code Detective Mission! 🕵️',
        description: 'Earth\'s systems are under attack! Work together to fix the code... but beware of the saboteur!',
        highlight: false,
        arrow: false
    },
    {
        id: 'academies',
        target: 'academy-stations',
        position: 'right',
        title: 'ACADEMY Stations 📚',
        description: 'Learn coding skills here! Visit these stations to unlock powers that help you complete challenges.',
        highlight: true,
        arrow: true
    },
    {
        id: 'challenges',
        target: 'challenge-stations',
        position: 'right',
        title: 'CHALLENGE Stations 🎯',
        description: 'Fix the broken code here to save Earth! Complete challenges to win... but watch for sabotage!',
        highlight: true,
        arrow: true
    },
    {
        id: 'hint-system',
        target: 'hint-button',
        position: 'bottom',
        title: 'Need Help? Ask Professor Gaia! 💡',
        description: 'Stuck on code? Professor Gaia can help detect bugs and guide you! (Extra helpful in Kids Mode)',
        highlight: true,
        arrow: false
    },
    {
        id: 'detective-work',
        target: 'task-board',
        position: 'bottom',
        title: 'Detective Work! 🔍',
        description: 'Watch for suspicious behavior! If code suddenly breaks or changes mysteriously, the saboteur might be nearby...',
        highlight: true,
        arrow: false
    },
    {
        id: 'start-journey',
        target: 'academy-solar',
        position: 'right',
        title: 'Start Your Mission! ⚡',
        description: 'Begin with an Academy to learn, then solve challenges! Work together to find the saboteur and save Earth!',
        highlight: true,
        arrow: true
    }
];
