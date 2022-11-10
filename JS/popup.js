//popup.js
// Saves options to chrome.storage
function save_options() {
    var whitelistInput = document.getElementById('whitelist').value.replace(/\r\n/g,"\n").split("\n");
    var blockNFT = document.getElementById('nft').value;
    chrome.storage.local.set({
      whitelist: whitelistInput,
      blockNFT: blockNFT
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Saved.';
      restore_options();
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }

  function restore_options() {
    chrome.storage.local.get(['whitelist', 'blockNFT'], function(items) {
        debugger;
      document.getElementById('whitelist').value = items.whitelist?.join('\n');
      document.getElementById('nft').value = items.nft?.blockNFT;
    });
  }

  window.onload = function(){
    restore_options();
}

  document.getElementById('save').addEventListener('click',
      save_options);

