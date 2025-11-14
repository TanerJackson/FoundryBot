import { Message } from "discord.js";
import fs from "fs";
import { itemValues } from "./itemValues.js";

const pointsFile = "./points.json";

let points = {};
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile, "utf8"));
}

let savePoints = () => {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
};
//addpoints
export function addPoints(username, itemName) {
  if (typeof username !== "string") {
    console.warn("⚠️ addPoints received a non-string username:", username);
    username = String(username);
  }

  const key = String(itemName).toLowerCase();

  if (!(key in itemValues)) {
    console.warn(`Unknown item used: ${itemName}`);
    points[username] = Number(points[username]) || 0;
    savePoints();
    return { error: `Unknown Item: ${itemName}` };
  }

  const amount = Number(itemValues[key]);

  if (!points[username]) points[username] = 0;

  if (typeof points[username] !== "number") {
    points[username] = parseInt(points[username], 10) || 0;
  }

  points[username] = Number(points[username]) + amount;
  savePoints();
}

export function getPoints(username) {
  if (typeof username !== "string") {
    messageLink.reply("username broken @TigerShrimp", username);
    username = String(username);
  }

  if (!points[username]) return 0;

  const value = Number(points[username]);
  return isNaN(value) ? 0 : value;
}

export function getAllPoints() {
  return points;
}
