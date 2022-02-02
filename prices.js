'use strict';

const arItemClasses = ['css-1nkm0kr'];
const arPriceClasses = ['css-coqxwd'];
const arQuantityClasses = ['css-s7rtpe', 'css-1ozq6kb'];

function CountPrices() {

	// Seek for items
	for (let strItemClass of arItemClasses) {
		console.log('strItemClass: ', strItemClass);
		let arItems = document.getElementsByClassName(strItemClass);

		for (let i = 0; i < arItems.length; i++) {

			// Get price
			for (let strPriceClass of arPriceClasses) {
				console.log('strPriceClass: ', strPriceClass);
				let arPrice = arItems[i].getElementsByClassName(strPriceClass);
				console.log('arPrice: ', arPrice);

				if (arPrice.length == 1) {

					let strPrice = arPrice[0].innerHTML;
					if (strPrice.indexOf('$') !== -1) {

						strPrice = strPrice.substring(strPrice.indexOf('$') + 1, strPrice.indexOf(' '));

						// Get quantity
						for (let strQuantityClass of arQuantityClasses) {
							console.log('strQuantityClass: ', strQuantityClass);
							let arCount = arItems[i].getElementsByClassName(strQuantityClass);

							if (arCount.length == 1) {

								let strCount = arCount[0].innerHTML;
								let nOzStart = strCount.indexOf(' oz');
								let nLbStart = strCount.indexOf(' lb');

								if ((strCount.indexOf('PricePerOzIsHere') === -1) && ((nOzStart !== -1) || (nLbStart !== -1)) && (strCount.indexOf(' per ') === -1)) {

									let nMulti = 1;
									if (nLbStart !== -1) {
										nMulti = 16;
									}

									let nEnd = strCount.indexOf(' fl ');
									if (nEnd === -1) {
										if (nOzStart !== -1) {
											nEnd = nOzStart;
										} else {
											nEnd = nLbStart;
										}
									}

									let strQuantity = strCount.substring(0, nEnd);
									let nQuantity = strQuantity * nMulti;

									nEnd = strQuantity.indexOf(' x ');
									if (nEnd !== -1) {
										nQuantity = strQuantity.substring(0, nEnd) * strQuantity.substring(nEnd + 3) * nMulti;
									}

									let fPricePerOz = strPrice / nQuantity;

									arCount[0].innerHTML = strCount + ' <span class="PricePerOzIsHere">(' + fPricePerOz.toFixed(2) + ' $/oz</span>)';
								}
							}
						}
					}
				}
			}
		}
	}
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

		// listen for messages sent from background.js
		if (request.message === 'check_prices') {

			CountPrices();

			// Select the node that will be observed for mutations
			const targetNode = document.querySelector('.css-1ctgftu-StoreMenuLayout');

			// Options for the observer (which mutations to observe)
			const config = { childList: true, subtree: true };

			// Callback function to execute when mutations are observed
			const callback = function(mutationsList, observer) {

				observer.disconnect();

				// Use traditional 'for loops' for IE 11
				for(const mutation of mutationsList) {
					if (mutation.type === 'childList') {

						CountPrices();
					}
				}

				observer.observe(targetNode, config);

			};

			// Create an observer instance linked to the callback function
			const observer = new MutationObserver(callback);

			// Start observing the target node for configured mutations
			observer.observe(targetNode, config);

		}
	}
);
