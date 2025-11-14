import fs from "fs";

const pointsFile = "./points.json";

let points = {};
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile, "utf8"));
}

let savePoints = () => {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
};
//addpoints
export function addPoints(username, amount) {
  if (typeof username !== "string") {
    console.warn("⚠️ addPoints received a non-string username:", username);
    username = String(username);
  }

  if (!points[username]) points[username] = 0;

  if (typeof points[username] !== "number") {
    points[username] = parseInt(points[username]) || 0;
  }
  let currentPoints = Number(points[username]) || 0;

  points[username] = currentPoints + amount;
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
