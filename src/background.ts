const allRegions = [
    'cn-north-1', 'cn-northwest-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'af-south-1', 'ap-east-1',
    'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2',
    'ap-northeast-1', 'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2',
    'eu-south-1', 'eu-west-3', 'eu-north-1', 'me-south-1', 'sa-east-1'
];

const allRegionsRegex = new RegExp(`(${allRegions.join('|')})`, 'g');
const globalServicePaths = ['/iam/', '/cloudfront/', '/s3/', '/route53/', '/trustedadvisor/'];

const redirectionTracker: { [tabId: number]: number[] } = {};
const LOOP_THRESHOLD_COUNT = 3; // 3 redirects
const LOOP_THRESHOLD_TIME = 2000; // in 2 seconds

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete' || !tab.url || !tab.url.startsWith('http')) {
        return;
    }
    const currentUrl = tab.url;

    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || {};
        if (settings.isEnabled === false) {
            return; // Redirection is disabled
        }

        try {
            const url = new URL(currentUrl);

            const isGlobalService = globalServicePaths.some(path => url.pathname.startsWith(path));
            if (isGlobalService) {
                console.log(`Skipping redirect for global service page: ${url.pathname}`);
                return;
            }

            let activeRegion: string | undefined;
            let isApplicableDomain = false;

            if (url.hostname.endsWith('console.amazonaws.cn')) {
                activeRegion = settings.activeChinaRegion;
                isApplicableDomain = true;
            } else if (url.hostname.endsWith('console.aws.amazon.com')) {
                activeRegion = settings.activeGlobalRegion;
                isApplicableDomain = true;
            }

            if (!isApplicableDomain || !activeRegion) {
                return;
            }

            const newUrl = currentUrl.replace(allRegionsRegex, activeRegion);

            if (newUrl !== currentUrl) {
                const now = Date.now();
                const history = redirectionTracker[tabId] || [];
                
                const recentHistory = history.filter(t => now - t < LOOP_THRESHOLD_TIME);
                recentHistory.push(now);
                redirectionTracker[tabId] = recentHistory;

                if (recentHistory.length >= LOOP_THRESHOLD_COUNT) {
                    console.error(`Redirect loop detected on tab ${tabId}. Disabling extension.`);
                    
                    chrome.storage.sync.set({ settings: { ...settings, isEnabled: false } });

                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'assets/icon128.png',
                        title: 'Redirect Loop Detected',
                        message: 'The URL changer has been automatically disabled, you may enter a loop directly. Please check your settings.',
                    });

                    delete redirectionTracker[tabId];
                    return; 
                }
                
                chrome.tabs.update(tabId, { url: newUrl });
            }

        } catch (error) {
            console.error('Error processing URL:', error);
        }
    });
});