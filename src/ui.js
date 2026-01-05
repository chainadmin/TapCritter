export function createUI() {
  const coinCount = document.querySelector("#coin-count");
  const tapButton = document.querySelector("#tap-upgrade");
  const idleButton = document.querySelector("#idle-upgrade");
  const modal = document.querySelector("#offline-modal");
  const modalText = document.querySelector("#offline-text");
  const collectButton = document.querySelector("#offline-collect");

  function update(state, costs) {
    coinCount.textContent = Math.floor(state.coins).toLocaleString();

    tapButton.textContent = `Upgrade Tap (+1) - ${costs.tapCost} coins (Lv ${state.tapLevel})`;
    idleButton.textContent = `Upgrade Idle (+0.2/s) - ${costs.idleCost} coins (Lv ${state.idleLevel})`;

    tapButton.disabled = state.coins < costs.tapCost;
    idleButton.disabled = state.coins < costs.idleCost;
  }

  function showOfflineModal(offlineCoins, onCollect) {
    if (offlineCoins <= 0) {
      return;
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modalText.textContent = `You earned ${offlineCoins.toLocaleString()} coins while away.`;

    collectButton.onclick = () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      onCollect();
    };
  }

  return {
    tapButton,
    idleButton,
    update,
    showOfflineModal,
  };
}
