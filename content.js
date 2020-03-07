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