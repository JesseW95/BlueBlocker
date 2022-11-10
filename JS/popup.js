//popup.js
// Saves options to chrome.storage
var whitelistta;
var blockNFTcb;
function save_options() {
    whitelistInput = whitelistta.value.replace(/\r\n/g,"\n").split("\n");
    blockNFT = blockNFTcb.value;
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
      whitelistta.value = items.whitelist?.join('\n');
      blockNFTcb.value = items.nft?.blockNFT;
      whitelistta.scrollTop = whitelistta.scrollHeight;
    });
  }

  window.onload = function(){
    whitelistta = document.getElementById('whitelist');
    blockNFTcb = document.getElementById('nft');
    restore_options();
}

  document.getElementById('save').addEventListener('click',
      save_options);

