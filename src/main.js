(function () {
  function boot(useSave) {
    var loaded = useSave ? Game.load() : null;
    Game.state = loaded || Game.createNewState();
    if (!loaded || !Game.state.actionLibrary || !Object.keys(Game.state.actionLibrary.unlocked || {}).length) {
      Game.buildStartingDeck();
      Game.addLog("新科进士入仕，授翰林清职。");
    }
    if (!Game.state.currentEvent && !Game.state.pendingReward && !Game.state.pendingSummary && !Game.state.ended) {
      Game.startEvent();
    }
    Game.boundState();
    Game.UI.render();
    if (Game.state.ended && Game.state.ending) {
      setTimeout(Game.UI.showEnding, 100);
    }
  }

  Game.startNewRun = function () {
    Game.clearSave();
    Game.state = Game.createNewState();
    Game.buildStartingDeck();
    Game.addLog("新科进士入仕，授翰林清职。");
    Game.startEvent();
    Game.UI.render();
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("end-button").addEventListener("click", function () {
      Game.endQuarter();
      Game.UI.render();
      if (Game.state.ended) Game.UI.showEnding();
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-view]"), function (button) {
      button.addEventListener("click", function () {
        var view = button.getAttribute("data-view");
        Game.UI.setView(view);
        window.location.hash = view === "main" ? "" : view;
      });
    });

    document.getElementById("save-button").addEventListener("click", function () {
      Game.save();
      Game.UI.render();
    });

    document.getElementById("restart-button").addEventListener("click", function () {
      if (confirm("确定重开？当前本地存档会被清除。")) {
        Game.startNewRun();
      }
    });

    document.getElementById("modal-close").addEventListener("click", Game.UI.hideModal);
    document.getElementById("modal").addEventListener("click", function (event) {
      if (event.target.id === "modal") Game.UI.hideModal();
    });

    boot(true);
    var hashView = (window.location.hash || "").replace("#", "");
    if (["relations", "deck", "life"].indexOf(hashView) >= 0) {
      Game.UI.setView(hashView);
    }
    if (Game.state.ended) Game.UI.setView("life");
  });
})();
