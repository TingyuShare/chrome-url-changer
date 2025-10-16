document.addEventListener('DOMContentLoaded', function () {
    const chinaRegionSelector = document.getElementById('chinaRegionSelector') as HTMLSelectElement;
    const globalRegionSelector = document.getElementById('globalRegionSelector') as HTMLSelectElement;
    const disableSwitch = document.getElementById('disableSwitch') as HTMLInputElement;
    const statusDiv = document.getElementById('status') as HTMLDivElement;

    const defaultSettings = {
        activeChinaRegion: 'cn-north-1',
        activeGlobalRegion: 'us-east-1',
        isEnabled: true
    };

    // Load settings and update UI
    chrome.storage.sync.get('settings', function (data) {
        const settings = { ...defaultSettings, ...data.settings };
        chinaRegionSelector.value = settings.activeChinaRegion;
        globalRegionSelector.value = settings.activeGlobalRegion;
        disableSwitch.checked = !settings.isEnabled;
        updateStatus(settings);
    });

    function updateStatus(settings: any) {
        if (!settings.isEnabled) {
            statusDiv.textContent = 'Redirection is disabled.';
            statusDiv.style.backgroundColor = '#f8d7da'; // Light red
        } else {
            statusDiv.innerHTML = `Global: <b>${settings.activeGlobalRegion}</b><br>China: <b>${settings.activeChinaRegion}</b>`;
            statusDiv.style.backgroundColor = '#d4edda'; // Light green
        }
    }

    function saveSettings(newSettings: any) {
        chrome.storage.sync.get('settings', function (data) {
            const settings = { ...defaultSettings, ...data.settings, ...newSettings };
            chrome.storage.sync.set({ settings }, function () {
                console.log('Settings saved:', settings);
                updateStatus(settings);
            });
        });
    }

    chinaRegionSelector.addEventListener('change', function () {
        saveSettings({ activeChinaRegion: this.value });
    });

    globalRegionSelector.addEventListener('change', function () {
        saveSettings({ activeGlobalRegion: this.value });
    });

    disableSwitch.addEventListener('change', function () {
        saveSettings({ isEnabled: !this.checked });
    });
});