# Tap Critter

## Overview
A simple tap-based idle/clicker game built with vanilla JavaScript and Vite. Players tap on a cute critter to earn coins and can purchase upgrades to increase tap power and idle earnings.

## Project Structure
- `index.html` - Main HTML entry point
- `style.css` - Global styles
- `src/` - JavaScript source files
  - `main.js` - Application entry point
  - `game.js` - Core game logic
  - `ui.js` - UI rendering and updates
  - `save.js` - Save/load game state
- `vite.config.js` - Vite configuration for development and build

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES Modules)
- **Build Tool**: Vite 5.x
- **Styling**: Plain CSS

## Development
Run the development server:
```bash
npm run dev
```
The app runs on port 5000.

## Building for Production
```bash
npm run build
```
Output is generated in the `dist/` folder.

## Game Features
- Tap the critter to earn coins
- Upgrade Tap: Increases coins per tap
- Upgrade Idle: Earns coins automatically over time
- Offline earnings: Earn coins while away
