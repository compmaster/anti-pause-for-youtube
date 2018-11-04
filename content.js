/**
 * Warning messages before pausing playback.
 * Not the best idea due to internalization but not to confuse with other popups.
 * TODO: Use inactivity checking instead of comparing message strings.
 * @type {string[]}
 */
let WARNING_MESSAGES = [
	'Nadal oglądasz? Film zostanie wkrótce wstrzymany'
];

/**
 * Confirmation messages after pausing playback.
 * Not the best idea due to internalization but not to confuse with other popups.
 * TODO: Use inactivity checking instead of comparing message strings.
 * @type {string[]}
 */
let PAUSED_MESSAGES = [
	'Film został wstrzymany. Chcesz oglądać dalej?'
];

/**
 * Injects inject.js script into YouTube site.
 */
document.addEventListener('DOMContentLoaded', () => {
	let script = document.createElement('script');
	script.src = chrome.extension.getURL('inject.js');
	script.onload = function () {
		console.log('[ANTI-PAUSE] Script injected');
	};
	(document.head || document.documentElement).appendChild(script);
});

/**
 * Observes node insertions and looks for ytd-popup-container children.
 */
new MutationObserver(function (mutations) {
	for (let mutation of mutations) {
		if (mutation.type === 'childList') {
			for (let node of mutation.addedNodes) {
				if (node instanceof HTMLElement && node.closest('ytd-popup-container')) {
					processPopupContainer(node.closest('ytd-popup-container'));
				}
			}
		}
	}
}).observe(document, {
	subtree: true,
	attributes: false,
	characterData: false,
	childList: true
});

/**
 * Processes popup.
 * @param {HTMLElement} node popup node
 */
function processPopupContainer(node) {
	let warningNode = node.querySelector('yt-notification-action-renderer');
	let messageNode = node.querySelector('yt-confirm-dialog-renderer');
	if (warningNode) {
		let paperToast = warningNode.querySelector('paper-toast');
		if (getComputedStyle(paperToast).display !== 'none') {
			let labelNode = paperToast.querySelector('span#label');
			let buttonNodes = paperToast.querySelectorAll('paper-button>yt-formatted-string');
			if (labelNode && buttonNodes.length === 1 && WARNING_MESSAGES.includes(labelNode.textContent.trim())) {
				console.log('[ANTI-PAUSE] This should not happen but it happened');
				console.log('[ANTI-PAUSE] Clicking YES on notification popup');
				buttonNodes[0].click();
			}
		}
	}
	if (messageNode && getComputedStyle(messageNode).style.display !== 'none') {
		let stringNode = messageNode.querySelector('papier-dialog-scrollable>div>yt-formatted-string');
		let buttonNodes = messageNode.querySelectorAll('paper-button>yt-formatted-string');
		if (stringNode && buttonNodes[0].length === 1 && PAUSED_MESSAGES.includes(stringNode.textContent.trim())) {
			console.log('[ANTI-PAUSE] This should not happen - movie paused');
			console.log('[ANTI-PAUSE] Clicking YES on dialog');
			buttonNodes[0].click();
		}
	}
}