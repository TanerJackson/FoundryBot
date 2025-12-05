import fs from "fs";

export function logAction(action, user) {
  const timestamp = new Date().toISOString();

  const logLine = `[${timestamp}] ${user} — ${action}\n`;

  fs.appendFile("./bot.log", logLine, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
}
