const STORAGE =  Object.freeze({
  'https://uaserial.top': [
    () => {
      const removeSelectors = [
        'body > header', '.block.movie .left.flex.column'
      ]
      for(const sel of removeSelectors){
        const els = document.querySelectorAll(sel);
        [...els].forEach(el => el?.remove())
      }
      const videoContainerHolder = document.querySelector('.block.movie .right.flex.column');
      if(videoContainerHolder){
        videoContainerHolder.style.flexGrow = '1';
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
    }
  ]
})

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function executeUrl(tab, origin){
  try {
       for(const func of (STORAGE[origin] || [])){
        chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func
      });
       }
    } catch (error) {
      console.error(error?.response?.data?.message || error);
    }
}

chrome.action.onClicked.addListener(async () => {
    const tab = await getCurrentTab()
    const origin = new URL(tab.url).origin
    const storage = (await chrome.storage.sync.get()) || {}
    const state = storage[origin]
    if(state){
      storage[origin] = 0
      chrome.storage.sync.set(storage)
      chrome.tabs.reload()
      return
    }
    executeUrl(tab, origin)
    storage[origin] = 1
    chrome.storage.sync.set(storage)
  })

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if(['loading', 'complete'].includes(changeInfo.status)){
    const tab = await getCurrentTab()
    const origin = new URL(tab.url).origin
    const storage = await chrome.storage.sync.get()
    const state = storage[origin]
    if(state){
      executeUrl(tab, origin)
    }
  }
})
