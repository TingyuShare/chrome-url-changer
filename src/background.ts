chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
      try {
        // 检查是否是 *.console.amazonaws.cn 域名
        const url = new URL(tab.url);
        if (url.hostname.endsWith('console.amazonaws.cn')) {
          chrome.storage.sync.get('selectedRegion', (data) => {
            if (data.selectedRegion) {
              const newUrl = tab.url!.replace(/(cn-northwest-1|cn-north-1)/g, data.selectedRegion);
              if (newUrl !== tab.url) {
                chrome.tabs.update(tabId, { url: newUrl });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error processing URL:', error);
      }
    }
  });