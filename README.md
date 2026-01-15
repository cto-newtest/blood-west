# Blood West - Western Duel Game

A Blood West-inspired western action game built with Three.js featuring realistic 3D graphics, physics-based gameplay, and full mobile support.

## 🎮 Play Now

Visit the deployed game at: **https://cto-newtest.github.io/blood-west/**

## Features

### Core Gameplay
- **Quick Draw Duels**: Face off against AI opponents in timed standoff scenarios
- **Timing-Based Combat**: React fast to win the draw and defeat your opponent
- **Multiple Rounds**: Progress through increasingly challenging duels
- **Ragdoll Physics**: Realistic death animations when enemies are defeated

### Visual Experience
- **3D Western Environment**: Detailed saloon and desert arena with cover objects
- **Dynamic Lighting**: Western sunset atmosphere with realistic sun and fog
- **First-Person Perspective**: Immersive cowboy view with head bob and sway
- **Particle Effects**: Dust, muzzle flashes, and impact effects

### Mobile Support
- **Touch Controls**: Large, responsive shoot button for mobile devices
- **Responsive UI**: Adapts to portrait and landscape orientations
- **Performance Optimized**: Runs smoothly on mobile devices

## Controls

### Desktop
| Action | Control |
|--------|---------|
| Shoot | Spacebar or Left Click |
| Aim | Mouse movement |

### Mobile/Touch
| Action | Control |
|--------|---------|
| Shoot | Tap the SHOOT button |
| Aim | Gyroscope (if available) |

### Menu Controls
| Action | Control |
|--------|---------|
| Start Game | Click/tap "Start Duel" |
| Change Difficulty | Click/tap difficulty button |
| View Controls | Click/tap "How to Play" |

## Difficulty Levels

- **Easy**: Slower reaction time, lower accuracy
- **Normal**: Balanced gameplay
- **Hard**: Fast reaction time, high accuracy

## Technical Stack

- **3D Rendering**: Three.js (WebGL)
- **Physics**: Custom ragdoll physics system
- **Build Tool**: Vite
- **Language**: Vanilla JavaScript (ES6+)
- **Audio**: Web Audio API for procedural sound effects
- **Deployment**: GitHub Pages (static site)

## Project Structure

```
blood-west/
├── index.html              # Main entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages auto-deploy
├── src/
│   ├── main.js             # Application entry point
│   ├── core/
│   │   ├── Game.js         # Main game loop & scene management
│   │   ├── PlayerController.js  # Player input & movement
│   │   ├── DuelSystem.js   # Duel timing & scoring
│   │   └── HUD.js          # UI elements
│   ├── world/
│   │   ├── WesternScene.js # Environment setup
│   │   ├── Arena.js        # Arena layout & props
│   │   └── Lighting.js     # Scene lighting
│   ├── physics/
│   │   ├── BallisticsSystem.js  # Bullet physics
│   │   └── RagdollPhysics.js    # Ragdoll death animations
│   ├── audio/
│   │   └── AudioManager.js # Sound effects
│   └── utils/
│       ├── InputManager.js # Input handling
│       └── Constants.js    # Game configuration
└── README.md               # This file
```

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/cto-newtest/blood-west.git
cd blood-west

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The game automatically deploys to GitHub Pages when you push to the main branch or the `feat-blood-west-threejs-gh-pages-mobile` branch.

The deployment workflow is defined in `.github/workflows/deploy.yml`.

## Game Mechanics

### Duel Flow
1. **Standoff Phase**: Both player and enemy face each other
2. **Countdown**: 3-second countdown before you can draw
3. **Quick Draw**: Press shoot as soon as the timer hits zero
4. **Resolution**: First to land a hit wins the round

### Health System
- Player has 100 HP (takes 34 damage per hit, dies in 3 hits)
- Enemy has 100 HP
- Health bars displayed on HUD during gameplay

### Scoring
- Track your kills across multiple rounds
- Difficulty increases with each defeated enemy
- Game over when player is defeated

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (Chrome Mobile, Safari Mobile)

## Performance

- **Desktop**: 60 FPS target
- **Mobile**: 30+ FPS target
- Optimized for low-end devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and personal use.

## Credits

- Built with [Three.js](https://threejs.org/)
- Inspired by Blood West game
- Procedural audio generated using Web Audio API

## Acknowledgments

- Three.js community for excellent documentation
- Vite for fast development experience
- GitHub Pages for free static hosting
