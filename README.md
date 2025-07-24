# Advanced Tetris Game

A modern, feature-rich Tetris game built with Next.js, TypeScript, and Tailwind CSS. Experience the classic puzzle game with smooth animations, responsive design, and advanced gameplay features.

[Live Demo](https://tetris-chuck.vercel.app/)

## 🎮 Features

### Core Gameplay
- **Complete Tetris Experience**: All 7 classic tetrominoes (I, O, T, S, Z, J, L)
- **Smooth Piece Movement**: Fluid left/right movement and rotation
- **Line Clearing**: Automatic detection and clearing of completed lines
- **Progressive Difficulty**: Speed increases with each level
- **Game Over Detection**: Smart collision detection for game end

### Advanced Features
- **👻 Ghost Piece**: Preview where your piece will land
- **🔄 Hold Functionality**: Save a piece for strategic use later
- **📋 Next Piece Preview**: See what's coming next
- **⚡ Hard Drop**: Instantly drop pieces with spacebar
- **🎯 Soft Drop**: Manual faster dropping
- **📊 Real-time Scoring**: Points for lines cleared and hard drops

### Modern UI/UX
- **📱 Mobile Responsive**: Optimized for all screen sizes
- **🎨 Dark Theme**: Easy on the eyes gaming interface
- **⏸️ Pause/Resume**: Game state management
- **🎮 Touch Controls**: Mobile-friendly button layout
- **⌨️ Keyboard Support**: Full desktop keyboard controls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Joebakid/tetris-game
cd tetris-game
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

## 🎮 How to Play

### Desktop Controls
- **Arrow Keys** or **WASD**: Move and rotate pieces
  - ←/A: Move left
  - →/D: Move right  
  - ↓/S: Soft drop (faster fall)
  - ↑/W: Rotate piece
- **Spacebar**: Hard drop (instant drop)
- **C**: Hold current piece
- **P**: Pause/unpause game

### Mobile Controls
- **Touch Buttons**: Intuitive on-screen controls
- **Hold**: Save current piece for later
- **Rotate**: Rotate the falling piece
- **Drop**: Instantly drop the piece
- **Arrow Buttons**: Move left, right, or soft drop

### Scoring System
- **Single Line**: 40 × level
- **Double Lines**: 100 × level  
- **Triple Lines**: 300 × level
- **Tetris (4 lines)**: 1200 × level
- **Hard Drop**: 2 points per cell dropped

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
advanced-tetris/
├── app/
│   ├── page.tsx          # Main game component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── README.md
```

## 🎯 Game Logic

### Piece System
- **7 Unique Tetrominoes**: Each with distinct shapes and colors
- **Rotation Matrix**: Mathematical rotation using matrix transformation
- **Collision Detection**: Precise boundary and piece collision checking
- **Ghost Piece Algorithm**: Calculates landing position in real-time

### Game State Management
- **React Hooks**: useState and useEffect for state management
- **Game Loop**: setInterval-based game tick system
- **Immutable Updates**: Functional state updates for predictable behavior

### Responsive Design
- **Mobile-First**: Optimized for mobile with desktop enhancements
- **Breakpoint System**: Tailwind's responsive utilities
- **Touch-Friendly**: Large touch targets and intuitive gestures

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Future Enhancements

- [ ] **Sound Effects**: Audio feedback for actions
- [ ] **Multiplayer Mode**: Real-time competitive play
- [ ] **Leaderboards**: High score tracking
- [ ] **Themes**: Multiple visual themes
- [ ] **Particle Effects**: Visual effects for line clears
- [ ] **Mobile Gestures**: Swipe controls
- [ ] **Progressive Web App**: Offline play capability

## 🙏 Acknowledgments

- Classic Tetris game mechanics
- Next.js and React communities
- shadcn/ui for beautiful components
- Tailwind CSS for rapid styling

---

**Enjoy playing Advanced Tetris! 🎮**

For questions or support, please open an issue on GitHub.
```

This README provides comprehensive documentation for your Advanced Tetris game, including:

- **Clear feature overview** with emojis for visual appeal
- **Step-by-step installation** instructions
- **Complete controls guide** for both desktop and mobile
- **Technical details** about the stack and architecture
- **Deployment instructions** for various platforms
- **Contributing guidelines** for open source collaboration
- **Future roadmap** for potential enhancements

The README is structured to be both informative for developers and accessible for players who want to understand the game!