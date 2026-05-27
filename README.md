# Eid Mubarak

i wanted to create a cute celebration for Eid with a small animated greeting project built with React and Vite. It presents a serene night scene with rising balloons, a glowing moon, a silhouette of Hagia Sophia, twinkling stars, and subtle motion effects for a polished celebration experience.

## Overview

This project demonstrates how to create a visually engaging greeting using modern front-end tooling without relying on external animation libraries. The animation is implemented using React components, CSS keyframes, and SVG graphics.

Key elements of the scene:

- A dark night sky with animated stars and shooting stars
- Colorful balloons floating upward
- A moon that rises toward the center of the screen
- A silhouette of Hagia Sophia as a cultural landmark
- A slow zoom effect that adds depth to the composition

## Live Preview

The app is designed to run locally using Vite and can also be deployed to GitHub Pages or any static hosting provider.

## Installation

1. Clone the repository or download the project files.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local development address displayed in the terminal, typically:

```bash
http://localhost:5173
```

## Project Structure

- `src/main.jsx` - Application entry point and mount logic
- `src/App.jsx` - Main layout and component wrapper
- `src/EidScene.jsx` - Animated Eid scene and visual composition
- `src/EidScene.css` - Styling and animation definitions
- `src/index.css` - Global styles
- `vite.config.js` - Vite configuration

## Deployment

This project is configured for deployment to GitHub Pages or any static hosting service.

To deploy to GitHub Pages:

1. Create a GitHub repository named `eid-mubarak`.
2. Ensure `vite.config.js` includes the correct `base` path, typically `/eid-mubarak/`.
3. Commit and push the project to GitHub.
4. Run the deploy script configured in `package.json`.

After deployment, the project will be available at:

## Built With

- React 18
- Vite
- CSS keyframe animations
- SVG graphics

## Customization

You can customize the greeting by updating the scene components and CSS styles. Common modifications include:

- Changing the balloon colors and animation timings
- Adjusting the moon position and motion
- Adding or replacing the background silhouette
- Tweaking the star density and animation speed


