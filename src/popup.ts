document.addEventListener('DOMContentLoaded', function() {
    const regionSelector = document.getElementById('regionSelector') as HTMLSelectElement;
    const saveButton = document.getElementById('save') as HTMLButtonElement;
    const contentDiv = document.getElementById('content') as HTMLDivElement;
  
    // 加载时显示已保存的区域
    chrome.storage.sync.get('selectedRegion', function(data) {
      if (data.selectedRegion) {
        regionSelector.value = data.selectedRegion;
        contentDiv.textContent = `current region: ${data.selectedRegion}`;
      }
    });
  
    saveButton.addEventListener('click', function() {
      const selectedRegion = regionSelector.value;
      chrome.storage.sync.set({ 'selectedRegion': selectedRegion }, function() {
        console.log('Region saved: ' + selectedRegion);
        // 更新显示的内容
        contentDiv.textContent = `saved region: ${selectedRegion}`;
        // 延迟关闭窗口，让用户看到保存成功的提示
        setTimeout(() => {
          window.close();
        }, 1000);
      });
    });
});