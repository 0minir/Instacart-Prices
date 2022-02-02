'use strict';

chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tabInfo) {
		if (tabInfo.url && changeInfo.status === 'complete') {
			if (tabInfo.url.indexOf('instacart') !== -1) {
				chrome.tabs.sendMessage( tabId, { message: 'check_prices' });
			}
		}
	}
);
