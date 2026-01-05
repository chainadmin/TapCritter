export const LOGICAL_WIDTH = 420;
export const LOGICAL_HEIGHT = 720;

const BOUNCE_DURATION = 0.18;

export function createGame(ctx) {
  const critter = {
    x: LOGICAL_WIDTH / 2,
    y: LOGICAL_HEIGHT / 2 + 80,
    radius: 120,
  };

  const animation = {
    time: 0,
    bounceTime: 0,
  };

  function triggerTap() {
    animation.bounceTime = BOUNCE_DURATION;
  }

  function update(deltaTime) {
    animation.time += deltaTime;
    if (animation.bounceTime > 0) {
      animation.bounceTime = Math.max(0, animation.bounceTime - deltaTime);
    }
  }

  function getBounceOffset() {
    const idleBob = Math.sin(animation.time * 2) * 6;
    let tapBob = 0;

    if (animation.bounceTime > 0) {
      const progress = 1 - animation.bounceTime / BOUNCE_DURATION;
      tapBob = Math.sin(progress * Math.PI) * 14;
    }

    return idleBob + tapBob;
  }

  function drawShadow(offset) {
    const shadowY = critter.y + critter.radius * 0.75;
    const clampOffset = Math.max(-20, Math.min(20, offset));
    const shadowScale = 1 - clampOffset / 60;

    ctx.save();
    ctx.translate(critter.x, shadowY);
    ctx.scale(shadowScale, shadowScale * 0.6);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 0, critter.radius * 0.7, critter.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCritter(offset) {
    const y = critter.y - offset;

    ctx.save();
    ctx.translate(critter.x, y);

    ctx.fillStyle = "#ffb957";
    ctx.beginPath();
    ctx.arc(0, 0, critter.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff9f1c";
    ctx.beginPath();
    ctx.arc(-40, -20, 20, 0, Math.PI * 2);
    ctx.arc(50, -25, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-35, -10, 22, 0, Math.PI * 2);
    ctx.arc(35, -10, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#24324d";
    ctx.beginPath();
    ctx.arc(-35, -8, 10, 0, Math.PI * 2);
    ctx.arc(35, -8, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-30, -12, 4, 0, Math.PI * 2);
    ctx.arc(40, -12, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2e9c6a";
    ctx.beginPath();
    ctx.moveTo(0, -critter.radius - 10);
    ctx.lineTo(-18, -critter.radius + 25);
    ctx.lineTo(10, -critter.radius + 30);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#1b7b4d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -critter.radius - 8);
    ctx.lineTo(6, -critter.radius + 20);
    ctx.stroke();

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    const offset = getBounceOffset();
    drawShadow(offset);
    drawCritter(offset);
  }

  function isHit(x, y) {
    const offset = getBounceOffset();
    const centerY = critter.y - offset;
    const distance = Math.hypot(x - critter.x, y - centerY);
    return distance <= critter.radius;
  }

  return {
    update,
    draw,
    isHit,
    triggerTap,
  };
}
