import { createGame, LOGICAL_HEIGHT, LOGICAL_WIDTH } from "./game.js";
import { createUI } from "./ui.js";
import { getOfflineEarnings, loadSave, saveGame } from "./save.js";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const state = {
  coins: 0,
  tapPower: 1,
  idleRate: 0,
  tapLevel: 0,
  idleLevel: 0,
};

const saved = loadSave();
if (saved) {
  state.coins = Number(saved.coins) || 0;
  state.tapPower = Number(saved.tapPower) || 1;
  state.idleRate = Number(saved.idleRate) || 0;
  state.tapLevel = Number(saved.tapLevel) || 0;
  state.idleLevel = Number(saved.idleLevel) || 0;
}

const ui = createUI();
const game = createGame(ctx);

const offlineCoins = getOfflineEarnings(saved);
ui.showOfflineModal(offlineCoins, () => {
  state.coins += offlineCoins;
});

function getTapCost() {
  return 25 + state.tapLevel * 15;
}

function getIdleCost() {
  return 25 + state.idleLevel * 15;
}

ui.tapButton.addEventListener("click", () => {
  const cost = getTapCost();
  if (state.coins < cost) {
    return;
  }
  state.coins -= cost;
  state.tapLevel += 1;
  state.tapPower += 1;
});

ui.idleButton.addEventListener("click", () => {
  const cost = getIdleCost();
  if (state.coins < cost) {
    return;
  }
  state.coins -= cost;
  state.idleLevel += 1;
  state.idleRate = Number((state.idleRate + 0.2).toFixed(2));
});

function resizeCanvas() {
  const container = canvas.parentElement;
  const header = document.querySelector(".top-bar");
  const padding = 96;
  const availableHeight = window.innerHeight - header.offsetHeight - padding;
  const availableWidth = container.clientWidth;
  const scale = Math.min(availableWidth / LOGICAL_WIDTH, availableHeight / LOGICAL_HEIGHT, 1);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = LOGICAL_WIDTH * dpr;
  canvas.height = LOGICAL_HEIGHT * dpr;
  canvas.style.width = `${LOGICAL_WIDTH * scale}px`;
  canvas.style.height = `${LOGICAL_HEIGHT * scale}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("pointerdown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * LOGICAL_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * LOGICAL_HEIGHT;

  if (game.isHit(x, y)) {
    state.coins += state.tapPower;
    game.triggerTap();
  }
});

let lastTime = performance.now();
let saveTimer = 0;

function loop(now) {
  const deltaTime = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  state.coins += state.idleRate * deltaTime;
  game.update(deltaTime);

  saveTimer += deltaTime;
  if (saveTimer >= 2) {
    saveGame(state);
    saveTimer = 0;
  }

  ui.update(state, {
    tapCost: getTapCost(),
    idleCost: getIdleCost(),
  });
  game.draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function saveNow() {
  saveGame(state);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveNow();
  }
});

window.addEventListener("beforeunload", saveNow);
