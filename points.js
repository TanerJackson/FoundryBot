import fs from "fs";
import { itemValues } from "./itemValues.js";

const pointsFile = "./points.json";
const cpointsFile = "./cpoints.json";

let points = {};
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile, "utf8"));
}

let savePoints = () => {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
};

let cpoints = {};
if (fs.existsSync(cpointsFile)) {
  cpoints = JSON.parse(fs.readFileSync(cpointsFile, "utf8"));
}

let saveCpoints = () => {
  fs.writeFileSync(cpointsFile, JSON.stringify(cpoints, null, 2));
};

//addpoints
function normalizeName(name) {
  return String(name)
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function addPoints(username, itemName) {
  username = normalizeName(username);
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
export function addComPoints(username, amount) {
  if (typeof username !== "string") {
    console.warn("⚠️ addComPoints received a non-string username:", username);
    username = String(username);
  }

  if (!cpoints[username]) cpoints[username] = 0;

  if (typeof cpoints[username] !== "number") {
    cpoints[username] = parseInt(cpoints[username], 10) || 0;
  }

  cpoints[username] = Number(cpoints[username]) + amount;
  saveCpoints();
}

export function addComPointsToMentions(message, amount) {
  const mentioned = message.mentions.members;

  if (!mentioned || mentioned.size === 0) {
    message.reply("⚠️ You must @mention at least one member!");
    return;
  }

  const appliedTo = [];

  mentioned.forEach((member) => {
    const username = member.displayName;
    addComPoints(username, amount);
    appliedTo.push(username);
  });

  message.reply(
    "✅ Added **" +
      amount +
      " points** to:\n" +
      appliedTo.map((u) => `• ${u}`).join("\n"),
  );
}

//get points
export function getPoints(username) {
  if (typeof username !== "string") {
    messageLink.reply("username broken @TigerShrimp", username);
    username = String(username);
  }

  if (!points[username]) return 0;

  const fValue = Number(points[username]);
  const cValue = Number(cpoints[username]);
  return [fValue, cValue];
}

export function getAllPoints() {
  return points;
}

export function getAllComPoints() {
  return cpoints;
}
