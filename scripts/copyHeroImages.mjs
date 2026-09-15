import fs from 'fs';
import path from 'path';

const brainDir = "C:/Users/The Laptop Sphere/.gemini/antigravity-ide/brain/42423f2c-b776-434c-b368-3e5ef8eb15ff";
const publicDir = "./public";

const mobileSrc = path.join(brainDir, "hero_mobile_clean_1789454448373.jpg");
const desktopSrc = path.join(brainDir, "hero_desktop_clean_1789454499181.jpg");

fs.copyFileSync(mobileSrc, path.join(publicDir, "hero_mobile.jpg"));
fs.copyFileSync(desktopSrc, path.join(publicDir, "hero_desktop.jpg"));
// Also overwrite hero.png so existing references work with high quality clean desktop version
fs.copyFileSync(desktopSrc, path.join(publicDir, "hero.png"));

console.log("✅ Hero images copied successfully into public folder!");
