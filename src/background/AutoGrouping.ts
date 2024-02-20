// 'use strict'

// /* global chrome, createImageBitmap, OffscreenCanvas */

// import * as ch from './chrome/promisify.js'
// import * as preferences from './preferences.js'

// chrome.runtime.onInstalled.addListener(onInstalled)
// chrome.tabs.onUpdated.addListener(onTabUpdated)
// chrome.tabs.onRemoved.addListener(onTabRemoved)
// chrome.tabs.onActivated.addListener(onTabActivated)
// chrome.runtime.onMessage.addListener(onMessageReceived)
// chrome.commands.onCommand.addListener(onCommandReceived)

// async function onInstalled (info) {
//   if (info && 'reason' in info && info.reason === 'install') {
//     await groupAllTabs()
//     await showOnboarding()
//   }
// }

// async function showOnboarding () {
//   try {
//     const url = chrome.runtime.getURL('onboarding/onboarding.html')

//     if (url) {
//       await ch.tabsCreate({ url })
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function onTabUpdated (tabId, changes, tab) {
//   if (changes.url && tabId) {
//     await addTabToGroup(tabId)
//   }
// }

// async function groupAllTabs () {
//   const allTabs = await getAllValidTabs(false)
//   const userPreferences = await preferences.get()
//   const ignorePinned = userPreferences.ignore_pinned.value;

//   if (!allTabs) return

//   const windows = {}

//   for (const tab of allTabs) {
//     if (ignorePinned && tab.pinned) {
//       continue
//     }

//     if (!windows[tab.windowId]) {
//       windows[tab.windowId] = []
//     }
//     windows[tab.windowId].push(tab)
//   }

//   let groupCriteria

//   if (userPreferences.group_by.value === 'subdomain') {
//     groupCriteria = 'domain'
//   } else {
//     groupCriteria = 'parentDomain'
//   }

//   await ungroupAllTabs(allTabs)

//   for (const windowId in windows) {
//     const windowTabs = windows[windowId]
//     const hostnames = findAllHostnamesInTabs(windowTabs, groupCriteria)

//     for (const hostname of hostnames) {
//       const tabsWithThisHostname = allTabsWithSameHostname(windowTabs, hostname, groupCriteria, ignorePinned)

//       if (!tabsWithThisHostname || tabsWithThisHostname.length === 1) continue

//       for (const tab of tabsWithThisHostname) {
//         if (tab.pinned) {
//           await ch.tabsUpdate(tab.id, { pinned: false })
//         }
//       }

//       const tabsToGroup = tabsWithThisHostname.map((tab) => tab.id)

//       const groupId = await ch
//         .tabsGroup({
//           tabIds: tabsToGroup,
//           createProperties: { windowId: parseInt(windowId) }
//         })
//         .catch((error) => {
//           console.error(error)
//           return -1
//         })

//       if (groupId === -1) continue

//       const parsedUrl = parseUrl(tabsWithThisHostname[0].pendingUrl || tabsWithThisHostname[0].url)
//       const siteName = groupCriteria === 'domain' ? parsedUrl.siteName : parsedUrl.host || 'Untitled'
//       const siteFaviconUrl = faviconURL(tabsWithThisHostname[0].pendingUrl || tabsWithThisHostname[0].url)
//       const groupColor = await getFaviconColor(siteFaviconUrl)

//       if (await groupExists(groupId)) {
//         try {
//           await ch.tabGroupsUpdate(groupId, { title: siteName, color: groupColor })
//         } catch (error) {
//           console.error(error)
//         }
//       }
//     }
//   }

//   if (userPreferences.sort_alphabetically.value === true) {
//     try {
//       await sortTabGroupsAlphabetically()
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }

// async function ungroupAllTabs (tabs) {
//   for (const tab of tabs) {
//     if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
//       try {
//         await ch.tabsUngroup(tab.id)
//       } catch (error) {
//         console.error(error)
//       }
//     }
//   }
// }

// async function onTabRemoved () {
//   if (!await extensionIsEnabled()) return

//   const userPreferences = await preferences.get()

//   if (userPreferences.auto_close_groups.value === false) return

//   const allTabs = await getAllValidTabs()

//   if (!allTabs) return

//   const groupCounts = getTabGroupCounts(allTabs)
//   const singleTabGroups = getSingleTabGroups(groupCounts)
//   const singleTabGroupIds = singleTabGroups.map(([groupId]) => parseInt(groupId))

//   for (const groupId of singleTabGroupIds) {
//     const tabToUngroup = allTabs.find((tab) => tab.groupId === groupId)
//     if (tabToUngroup) {
//       try {
//         await ch.tabsUngroup(tabToUngroup.id)
//       } catch (error) {
//         console.error(error)
//       }
//     }
//   }
// }

// async function onTabActivated (info) {
//   if (!await extensionIsEnabled()) return

//   const userPreferences = await preferences.get()

//   if (userPreferences.auto_collapse_groups.value === false) return

//   await collapseUnusedGroups(info.tabId)
// }

// async function addTabToGroup (tabId) {
//   if (!await extensionIsEnabled()) return

//   const targetTab = await ch.tabsGet(tabId).catch((error) => {
//     console.error(error)
//     return null
//   })

//   const userPreferences = await preferences.get()
//   const ignorePinned = userPreferences.ignore_pinned.value;

//   if (!targetTab) return

//   if (ignorePinned && targetTab.pinned) {
//     return
//   } else if (targetTab.pinned) {
//     await ch.tabsUpdate(targetTab.id, { pinned: false })
//   }

//   const targetTabUrl = targetTab.pendingUrl || targetTab.url || null

//   if (!targetTabUrl || isExcluded(targetTabUrl)) return

//   const parsedUrl = parseUrl(targetTabUrl)
//   const allTabs = await getAllValidTabs()

//   if (!allTabs) return

//   let groupCriteria

//   if (userPreferences.group_by.value === 'subdomain') {
//     groupCriteria = 'domain'
//   } else {
//     groupCriteria = 'parentDomain'
//   }

//   const tabsInGroup = findTabsInGroup(allTabs, targetTab)
//   const groupHasSameHostname = allTabsContainsHostname(tabsInGroup, parsedUrl[groupCriteria], groupCriteria)

//   if (tabsInGroup.length && groupHasSameHostname && targetTab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
//     // this means the tab doesn't need to move, don't do anything
//     return
//   } else if (targetTab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
//     // This means the tab needs to move
//     try {
//       await ch.tabsUngroup(targetTab.id)

//       if (userPreferences.auto_close_groups.value === true && await groupExists(targetTab.groupId)) {
//         await checkAndUngroupIfSingle(targetTab.groupId)
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const targetGroupId = findTargetGroupId(allTabs, targetTab, parsedUrl[groupCriteria], groupCriteria)

//   if (targetGroupId !== null && await groupExists(targetGroupId)) {
//     try {
//       await ch.tabsGroup({ tabIds: [targetTab.id], groupId: targetGroupId })
//     } catch (error) {
//       console.error(error)
//     }
//   } else {
//     const matchingTabs = allTabsWithSameHostname(allTabs, parsedUrl[groupCriteria], groupCriteria, ignorePinned);

//     if (matchingTabs.length > 1) {
//       const matchingTabsIds = matchingTabs.map((t) => t.id)

//       const newGroupId = await ch.tabsGroup({ tabIds: matchingTabsIds }).catch((error) => {
//         console.error(error)
//         return -1
//       })

//       if (newGroupId === -1) return

//       const siteName = groupCriteria === 'domain' ? parsedUrl.siteName : parsedUrl.host || 'Untitled'
//       const siteFaviconUrl = faviconURL(matchingTabs[0].pendingUrl || matchingTabs[0].url)
//       const groupColor = await getFaviconColor(siteFaviconUrl)

//       if (await groupExists(newGroupId)) {
//         try {
//           await ch.tabGroupsUpdate(newGroupId, { title: siteName, color: groupColor })
//         } catch (error) {
//           console.error(error)
//         }
//       }

//       if (userPreferences.sort_alphabetically.value === true) {
//         try {
//           await sortTabGroupsAlphabetically()
//         } catch (error) {
//           console.error(error)
//         }
//       }
//     }
//   }
// }

// async function checkAndUngroupIfSingle (tabGroupId) {
//   try {
//     const groupTabs = await ch.tabsQuery({ groupId: tabGroupId })
//     if (groupTabs.length <= 1) {
//       await ch.tabsUngroup(groupTabs[0].id)
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function collapseUnusedGroups (tabId) {
//   const allTabs = await ch.tabsQuery({ currentWindow: true }).catch((error) => {
//     console.error(error)
//     return []
//   })

//   if (!allTabs) return

//   const tabActivated = allTabs.find((tab) => tab.id === tabId)

//   if (!tabActivated) return

//   const activeTabGroupId = tabActivated.groupId

//   if (activeTabGroupId === undefined) return

//   const otherGroupIds = allTabs.filter((tab) => tab.groupId !== activeTabGroupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE).map((tab) => tab.groupId)
//   const uniqueOtherGroupIds = [...new Set(otherGroupIds)]

//   const MAX_RETRIES = 5
//   const RETRY_DELAY = 25

//   for (const groupId of uniqueOtherGroupIds) {
//     if (!groupId) continue
//     let retries = 0
//     while (retries < MAX_RETRIES) {
//       try {
//         if (await groupExists(groupId)) {
//           await ch.tabGroupsUpdate(groupId, { collapsed: true })
//         }
//         break
//       } catch (error) {
//         retries++
//         await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
//       }
//     }
//   }
// }

// async function extensionIsEnabled () {
//   try {
//     const userPreferences = await preferences.get()
//     return userPreferences.enabled.value
//   } catch (error) {
//     console.error(error)
//     return true
//   }
// }

// function findTabsInGroup(allTabs, targetTab, ignorePinned) {
//   return allTabs.filter((t) => {
//     return t.groupId === targetTab.groupId && t.id !== targetTab.id && (!ignorePinned || !t.pinned);
//   });
// }

// function allTabsContainsHostname (tabsInGroup, targetTabHostName, criteria) {
//   return tabsInGroup.some((t) => parseUrl(t.pendingUrl || t.url || '')[criteria] === targetTabHostName)
// }

// function findTargetGroupId (allTabs, targetTab, targetTabHostName, criteria) {
//   for (const tab of allTabs) {
//     if (tab.id === targetTab.id) continue // Skip the target tab

//     const parsedUrl = parseUrl(tab.pendingUrl || tab.url)

//     const tabHostname = parsedUrl[criteria]
//     if (tabHostname === targetTabHostName && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
//       return tab.groupId
//     }
//   }

//   return null
// }

// function allTabsWithSameHostname(allTabs, targetTabHostName, criteria, ignorePinned) {
//   return allTabs.filter((tab) => {
//     const parsedUrl = parseUrl(tab.pendingUrl || tab.url);
//     const tabHostname = parsedUrl[criteria];
//     return tabHostname === targetTabHostName && (!ignorePinned || !tab.pinned);
//   });
// }

// async function getAllValidTabs (onlyCurrentWindow = true) {
//   const queryInfo = onlyCurrentWindow ? { currentWindow: true } : {}

//   const allTabs = await ch.tabsQuery(queryInfo).catch((error) => {
//     console.error(error)
//     return []
//   })

//   if (!allTabs) return null

//   const validTabs = allTabs.filter((tab) => {
//     const tabUrl = tab.pendingUrl || tab.url || ''
//     return !isExcluded(tabUrl)
//   })

//   return validTabs.length ? validTabs : null
// }

// function findAllHostnamesInTabs (allTabs, criteria) {
//   return [...new Set(allTabs.map((tab) => parseUrl(tab.pendingUrl || tab.url || '')[criteria]).filter(Boolean))]
// }

// function getTabGroupCounts (allTabs) {
//   return allTabs.reduce((acc, tab) => {
//     if (tab && tab.groupId !== undefined && tab.groupId !== null && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
//       acc[tab.groupId] = (acc[tab.groupId] || 0) + 1
//     }
//     return acc
//   }, {})
// }

// function getSingleTabGroups (groupCounts) {
//   return Object.entries(groupCounts).filter(([_, count]) => count === 1)
// }

// function faviconURL (u) {
//   const url = new URL(chrome.runtime.getURL('/_favicon/'))
//   url.searchParams.set('pageUrl', u)
//   url.searchParams.set('size', '16')
//   return url.toString()
// }

// function isExcluded (url) {
//   const excludedUrls = ['chrome://', 'chrome-extension://', 'edge://', 'extension://', 'brave://', 'opera://', 'vivaldi://']

//   return excludedUrls.some((excluded) => url.startsWith(excluded))
// }

// function calculateDistance (color1, color2) {
//   const dr = color1.r - color2.r
//   const dg = color1.g - color2.g
//   const db = color1.b - color2.b
//   return Math.sqrt(dr * dr + dg * dg + db * db)
// }

// async function getFaviconColor (faviconUrl) {
//   const colors = [
//     { name: 'grey', rgb: { r: 130, g: 130, b: 130 } },
//     { name: 'blue', rgb: { r: 20, g: 100, b: 255 } },
//     { name: 'red', rgb: { r: 255, g: 40, b: 30 } },
//     { name: 'yellow', rgb: { r: 255, g: 170, b: 0 } },
//     { name: 'green', rgb: { r: 20, g: 130, b: 50 } },
//     { name: 'pink', rgb: { r: 200, g: 20, b: 130 } },
//     { name: 'purple', rgb: { r: 160, g: 60, b: 240 } },
//     { name: 'cyan', rgb: { r: 0, g: 130, b: 128 } },
//     { name: 'orange', rgb: { r: 255, g: 140, b: 60 } }
//   ]

//   const isIgnoredPixel = (r, g, b, a) => {
//     const whiteValue = 255
//     return a === 0 || (r === whiteValue && g === whiteValue && b === whiteValue)
//   }

//   try {
//     const response = await fetch(faviconUrl)
//     const blob = await response.blob()
//     const imageBitmap = await createImageBitmap(blob)
//     const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
//     const ctx = canvas.getContext('2d')
//     ctx.drawImage(imageBitmap, 0, 0)
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

//     const colorHistogram = {}

//     for (let i = 0; i < imageData.length; i += 4) {
//       if (!isIgnoredPixel(imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3])) {
//         const quantizedColor = quantize(imageData[i], imageData[i + 1], imageData[i + 2])
//         const colorKey = `${quantizedColor.r}-${quantizedColor.g}-${quantizedColor.b}`
//         colorHistogram[colorKey] = (colorHistogram[colorKey] || 0) + 1
//       }
//     }

//     const isGray = (r, g, b, threshold = 15) => {
//       return Math.abs(r - g) <= threshold && Math.abs(r - b) <= threshold && Math.abs(g - b) <= threshold
//     }

//     const dominantColorKey = Object.keys(colorHistogram).reduce((a, b) => (colorHistogram[a] > colorHistogram[b] ? a : b))
//     const dominantColorParts = dominantColorKey.split('-').map((value) => parseInt(value, 10))

//     const rAvg = dominantColorParts[0]
//     const gAvg = dominantColorParts[1]
//     const bAvg = dominantColorParts[2]

//     if (isGray(rAvg, gAvg, bAvg)) {
//       return 'grey'
//     }

//     let closestColor = colors[0]
//     let minDistance = calculateDistance(
//       {
//         r: dominantColorParts[0],
//         g: dominantColorParts[1],
//         b: dominantColorParts[2]
//       },
//       closestColor.rgb
//     )

//     for (let i = 1; i < colors.length; i++) {
//       const distance = calculateDistance(
//         {
//           r: dominantColorParts[0],
//           g: dominantColorParts[1],
//           b: dominantColorParts[2]
//         },
//         colors[i].rgb
//       )
//       if (distance < minDistance) {
//         minDistance = distance
//         closestColor = colors[i]
//       }
//     }

//     return closestColor.name
//   } catch (error) {
//     console.error(error)
//     return 'grey'
//   }
// }

// function quantize (r, g, b, granularity = 15) {
//   return {
//     r: Math.round(r / granularity) * granularity,
//     g: Math.round(g / granularity) * granularity,
//     b: Math.round(b / granularity) * granularity
//   }
// }

// function parseUrl (inputUrl) {
//   if (!inputUrl || inputUrl.length === 0) {
//     return {}
//   }

//   const url = new URL(inputUrl)
//   const domainParts = url.hostname.split('.')

//   let topLevelDomain
//   let subdomain = ''

//   topLevelDomain = domainParts.pop()

//   const secondaryTLDs = ['co', 'com', 'ac', 'gov', 'net', 'org', 'edu']
//   if (domainParts.length && secondaryTLDs.includes(domainParts[domainParts.length - 1])) {
//     topLevelDomain = `${domainParts.pop()}.${topLevelDomain}`
//   }

//   const host = domainParts.pop()

//   if (domainParts.length) {
//     subdomain = domainParts.join('.')
//   }

//   let siteName
//   if (subdomain === 'www') {
//     siteName = host
//   } else {
//     siteName = subdomain.length > 0 ? `${subdomain}.${host}` : host
//   }

//   return {
//     protocol: url.protocol.slice(0, -1),
//     domain: url.hostname,
//     path: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname,
//     subdomain,
//     host,
//     tld: topLevelDomain,
//     parentDomain: host ? `${host}.${topLevelDomain}` : '',
//     siteName
//   }
// }

// async function onMessageReceived (message, sender, sendResponse) {
//   try {
//     if (message.msg === 'preference_updated') {
//       sendResponse()

//       const isEnabledToggled = message.id === 'enabled' && message.value === true
//       const isGroupByChanged = message.id === 'group_by' && (await extensionIsEnabled())
//       const isSortChanged = message.id === 'sort_alphabetically' && (await extensionIsEnabled()) && message.value === true
//       const isPinnedChanged = message.id === 'ignore_pinned' && (await extensionIsEnabled())

//       if (isEnabledToggled || isGroupByChanged || isPinnedChanged) {
//         await groupAllTabs()
//       } else if (isSortChanged) {
//         await sortTabGroupsAlphabetically()
//       }
//     } else if (message.msg === 'group_now') {
//       sendResponse()

//       await groupAllTabs()
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function onCommandReceived (command) {
//   if (command === 'group_all') {
//     await groupAllTabs()
//   }
// }

// async function groupExists (groupId) {
//   try {
//     const group = await ch.tabGroupsGet(groupId)
//     return group !== undefined && group !== null
//   } catch (error) {
//     return false
//   }
// }

// async function sortTabGroupsAlphabetically () {
//   try {
//     const allGroups = await ch.tabGroupsQuery({})
//     const currentWindow = await ch.windowsGetCurrent()

//     const groupSizeMap = {}
//     for (const group of allGroups) {
//       const tabsInGroup = await ch.tabsQuery({ groupId: group.id })
//       groupSizeMap[group.id] = tabsInGroup.length
//     }

//     const sorted = allGroups.sort((a, b) => a.title.localeCompare(b.title))

//     const pinnedCount = await getPinnedTabsCount(currentWindow.id)
//     let currentIndex = pinnedCount

//     for (const group of sorted) {
//       await ch.tabGroupsMove(group.id, { index: currentIndex })
//       // Increase the currentIndex by the number of tabs in the current group
//       currentIndex += groupSizeMap[group.id]
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function getPinnedTabsCount (windowId) {
//   const pinnedTabs = await ch.tabsQuery({ windowId, pinned: true })
//   return pinnedTabs.length
// }
