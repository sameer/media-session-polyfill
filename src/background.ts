// Forward command to the most recent supported tab.
const supportedSiteRegexes: RegExp[] = [
    /https:\/\/music\.amazon\.com\/*/,
    /https:\/\/www\.amazon.com\/(Amazon-Video|gp\/video)\/*/,
    /https:\/\/primevideo.com\/*/,
    /https:\/\/www\.youtube\.com\/*/
];

const callback: browser.runtime.onMessagePromise = (message: any, sender, _sendResponse) => {
    if (message.key) {
        browser.tabs.query({}).then(tabs => {
            const sortedTabs = tabs
                .filter(tab => tab.id != -1 && tab.id != browser.tabs.TAB_ID_NONE)
                .filter(tab => supportedSiteRegexes.filter(regex => tab.url && regex.test(tab.url)).length > 0)
                .sort((a, b) => a.lastAccessed - b.lastAccessed)
                .reverse();
            if (sortedTabs.length > 0 && sortedTabs[0].id) {
                browser.tabs.sendMessage(sortedTabs[0].id, message);
            }
        });
    }
    return Promise.resolve();
};
browser.runtime.onMessage.addListener(callback);
