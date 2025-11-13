import fs from "fs";

const pointsFile = "./points.json";

let points = {};
if (fs.existsSync(pointsFile)) {
  points = JSON.parse(fs.readFileSync(pointsFile, "utf8"));
}

let savePoints = () => {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
};

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
