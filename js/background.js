
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.action.onClicked.addListener(async () => {
    const tab = await getCurrentTab()
    let func = function(){
      const removeSelectors = [
        'body > header'
      ]
      for(const sel of removeSelectors){
        const els = document.querySelectorAll(sel);
        [...els].forEach(el => el?.remove())
      }
      const videoHolder = document.querySelector('.player.embed .video-holder.flex.stretch');
      if(videoHolder){
        videoHolder.style.position = 'fixed';
        videoHolder.style.height = '100%';
        videoHolder.style.zIndex = '1001';
      }
      const playok = document.querySelector('#precont > div.gview.sbfixed.tstatact.sbdropvis > div.bcont.noth.usno'
      );
      if(playok){
        playok.style.marginRight = '0';
      }
    };
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func
    });
  })

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if(['loading', 'complete'].includes(changeInfo.status)){
    
//     chrome.scripting.executeScript({
//       target: {tabId: tab.id},
//       func
//     });
//   }
// })