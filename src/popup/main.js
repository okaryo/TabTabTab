chrome.tabs.query({ currentWindow: true }, (tabs) => {
  const ul = document.getElementById('current-window_tab-list')
  setTimeout(createTabListAtCurrentWindow(tabs, ul), 0)
})

chrome.tabs.query({ currentWindow: false }, (tabs) => {
  if (tabs.length === 0) return

  setTimeout(() => {
    const currentWindowHeader = document.createElement('h3')
    currentWindowHeader.innerHTML = 'Current Window'
    const currentWindowTabList = document.getElementById('current-window_tab-list')
    currentWindowTabList.parentNode.insertBefore(currentWindowHeader, currentWindowTabList)

    const windowIds = new Set()
    for (let tab of tabs) {
      windowIds.add(tab.windowId)
    }

    let windowNumber = 1
    for (let windowId of windowIds) {
      createTabListAtOtherWindow(windowNumber, windowId)
      windowNumber ++
    }
  }, 50)
})

const createTabListAtCurrentWindow = (tabs, ul) => {
  for (let tab of tabs) {
    const li = document.createElement('li')

    const a = document.createElement('a')
    a.addEventListener('click', () => {
      chrome.windows.update(tab.windowId, { focused: true })
      chrome.tabs.update(tab.id, { active: true })
    })
    
    const favicon = document.createElement('img')
    favicon.src = tab.favIconUrl
    if (tab.favIconUrl === '' || tab.favIconUrl === undefined) {
      favicon.src = 'images/tabtabtab128.png'
    }

    const p = document.createElement('p')
    if (tab.pinned) {
      p.innerHTML = `<i class="fas fa-thumbtack" style="margin-right:3px;"></i>${tab.title}`
    } else {
      p.innerHTML = tab.title
    }
    

    const closeIcon = document.createElement('span')
    closeIcon.innerHTML = '&times;'
    closeIcon.addEventListener('click', () => {
      chrome.tabs.remove(tab.id)
      li.remove()
    })

    if (tab.active) {
      a.style.backgroundColor = '#e6fffa'
    }

    ul.appendChild(li)
    li.appendChild(a)
    li.appendChild(closeIcon)
    a.appendChild(favicon)
    a.appendChild(p)
  }
}

const createTabListAtOtherWindow = (windowNumber, windowId) => {
  const body = document.getElementsByTagName('body')[0]
  const otherWindowHeader = document.createElement('h3')
  otherWindowHeader.innerHTML = `Other Window${windowNumber}`

  const ul = document.createElement('ul')

  chrome.tabs.query({ windowId: windowId }, (tabs) => {
    for (let tab of tabs) {
      const li = document.createElement('li')
  
      const a = document.createElement('a')
      a.addEventListener('click', () => {
        chrome.windows.update(tab.windowId, { focused: true })
        chrome.tabs.update(tab.id, { active: true })
      })
      
      const favicon = document.createElement('img')
      favicon.src = tab.favIconUrl
      if (tab.favIconUrl === '' || tab.favIconUrl === undefined) {
        favicon.src = 'images/tabtabtab128.png'
      }
  
      const p = document.createElement('p')
      if (tab.pinned) {
        p.innerHTML = `<i class="fas fa-thumbtack" style="margin-right:3px;"></i>${tab.title}`
      } else {
        p.innerHTML = tab.title
      }
      
  
      const closeIcon = document.createElement('span')
      closeIcon.innerHTML = '&times;'
      closeIcon.addEventListener('click', () => {
        chrome.tabs.remove(tab.id)
        li.remove()
      })
  
      ul.appendChild(li)
      li.appendChild(a)
      li.appendChild(closeIcon)
      a.appendChild(favicon)
      a.appendChild(p)
    }
  })

  body.appendChild(otherWindowHeader)
  body.appendChild(ul)
}
