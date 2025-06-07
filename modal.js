(function() {
  const overlay = document.getElementById('modalOverlay');
  const messageBox = document.getElementById('modalMessage');
  const okBtn = document.getElementById('modalOkBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');

  function show(message, confirm) {
    messageBox.textContent = message;
    cancelBtn.style.display = confirm ? 'inline-block' : 'none';
    overlay.style.display = 'flex';
    return new Promise(resolve => {
      function cleanup(result) {
        overlay.style.display = 'none';
        okBtn.removeEventListener('click', okHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
        resolve(result);
      }
      function okHandler() { cleanup(true); }
      function cancelHandler() { cleanup(false); }
      okBtn.addEventListener('click', okHandler);
      cancelBtn.addEventListener('click', cancelHandler);
    });
  }

  window.Modal = {
    alert(message) {
      return show(message, false);
    },
    confirm(message) {
      return show(message, true);
    }
  };
})();
