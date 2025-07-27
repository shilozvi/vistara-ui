// 🎯 Vistara UI - MINIMAL Export for TitanMind Integration
// Only essential working components to avoid React Hook errors

// ONLY TasksTable - the component TitanMind actually needs
export { default as TasksTable } from './src/components/data/TasksTable.jsx';

// CSS styles
export const stylesPath = './dist/styles.css';

// ⚠️ WARNING: Do NOT add more exports here!
// Adding more components causes React Hook errors in TitanMind
// lib.js can have full exports for other projects, but this file is minimal for TitanMind