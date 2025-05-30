const ONETIMERS = [
  () => {
    [...document.querySelectorAll('span.fc-preference-slider [type="checkbox"]')]
      .filter(el => el.checked)
      .forEach((el, i, arr) => (el.checked = false, i === arr.length - 1 && console.log(`unchecked: ${arr.length}`)))
  }
]

const CHROME_FUNCTIONS = Object.freeze({
  'https://roboatino.itch.io': [
    tab => {
      chrome.tabs.update(tab.id, {
        url: 'https://html-classic.itch.zone/html/6187898/ShogunShowdown_WebGL/index.html'
      })
    }
  ],
  'https://wired-dreams-studio.itch.io': [
    tab => {
      chrome.tabs.update(tab.id, {
        url: 'https://html-classic.itch.zone/html/5481547/index.html'
      })
    }
  ],

})

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
  ],
  'https://html-classic.itch.zone/html/6187898/ShogunShowdown_WebGL/index.html': [
    () => {
      // Shogun Game fullscreen
      const canvas = document.getElementById('unity-canvas')
      if(canvas){
        canvas.style.width = '100vw'
      }
    }
  ],
  'https://html-classic.itch.zone/html/5481547/index.html': [
    () => {
      // Frogue Fullscreen fullscreen
      const canvas = document.getElementById('canvas')
      console.log(canvas);
      
      if(canvas){
        canvas.style.height = '100vh'
      }
    }
  ],
  'https://www.playok.com/en/spades/#\\d': [
    () => {
      function fullSize(){
        setTimeout(() => {
        document.getElementById('appcont').style.top = '0';
        document.getElementById('appcont').style.maxWidth = 'none';
        document.querySelector('.gview').style.height = '100vh';
        document.querySelector('#precont > .gview > .bcont.noth > canvas').style.height = '100vh';
      }, 1000)
      }
      window.addEventListener('resize', fullSize)
      fullSize()
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

function runOneTimers(tab){
  for(const func of (ONETIMERS || [])){
      chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func
    });
  }
}

function runChromeFunctions(tab){
  const origin = new URL(tab.url).origin
  for(const func of CHROME_FUNCTIONS[origin] || []){
    func(tab)
  }
}

chrome.action.onClicked.addListener(async () => {
    const tab = await getCurrentTab()
    const tabUrl = new URL(tab.url)
    console.log(tabUrl);
    Object.keys(STORAGE).forEach(async match => {
      if(new RegExp(match).test(tabUrl.href)){
        const storage = (await chrome.storage.sync.get()) || {}
        const state = storage[match]
        if(state){
          storage[match] = 0
          chrome.storage.sync.set(storage)
          chrome.tabs.reload()
          return
        }
        executeUrl(tab, match)
        storage[match] = 1
        chrome.storage.sync.set(storage)
      }
    })
    runOneTimers(tab)
    runChromeFunctions(tab)
  })

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if(['loading', 'complete'].includes(changeInfo.status)){
    const tab = await getCurrentTab()
    const tabUrl = new URL(tab.url)
    console.log(tabUrl);
    Object.keys(STORAGE).forEach(async match => {
      if(new RegExp(match).test(tabUrl.href)){  
        const storage = await chrome.storage.sync.get()
        const state = storage[match]
        if(state){
          executeUrl(tab, match)
        }
      }
    })
  }
})
