// TODO: If tab is in background, auto-play is paused. Examine why.

/**
 * Modifies YouTube experiment flags to disable playback and auto-play pause.
 * NOTICE: It has been proven that modifying the following flags has no effect.
 */
function disableAutoPause() {
	let config = window && window.yt && window.yt.config_ || window.ytcfg && window.ytcfg.data_;
	let experimentFlags = config && config.EXPERIMENT_FLAGS;
	if (experimentFlags instanceof Object) {
		if (experimentFlags.is_part_of_any_user_engagement_experiment) {
			experimentFlags.is_part_of_any_user_engagement_experiment = false;
			console.log('[ANTI-PAUSE] Disabled is_part_of_any_user_engagement_experiment');
		}
		if (experimentFlags.user_engagement_enable_autoplay_pause_feature) {
			experimentFlags.user_engagement_enable_autoplay_pause_feature = false;
			console.log('[ANTI-PAUSE] Disabled user_engagement_enable_autoplay_pause_feature');
		}
		if (experimentFlags.enable_autoplay_pause_by_lact) {
			experimentFlags.enable_autoplay_pause_by_lact = false;
			console.log('[ANTI-PAUSE] Disabled enable_autoplay_pause_by_lact');
		}
		if (experimentFlags.enable_watch_next_pause_autoplay_lact) {
			experimentFlags.enable_watch_next_pause_autoplay_lact = false;
			console.log('[ANTI-PAUSE] Disabled enable_watch_next_pause_autoplay_lact');
		}
		if (experimentFlags.watch_next_pause_autoplay_lact_sec !== Number.MAX_SAFE_INTEGER) {
			experimentFlags.watch_next_pause_autoplay_lact_sec = Number.MAX_SAFE_INTEGER;
			console.log('[ANTI-PAUSE] Increased watch_next_pause_autoplay_lact_sec');
		}
		if (!experimentFlags.kevlar_player_always_autoplay) {
			experimentFlags.kevlar_player_always_autoplay = true;
			console.log('[ANTI-PAUSE] Enabled kevlar_player_always_autoplay');
		}
		if (!experimentFlags.disable_youthere_lact_threshold_check) {
			experimentFlags.disable_youthere_lact_threshold_check = true;
			console.log('[ANTI-PAUSE] Enabled disable_youthere_lact_threshold_check');
		}
	} else {
		console.log('[ANTI-PAUSE] YouTube configuration not found');
	}
}

/**
 * Increases auto-nav idle timeout in behavior of ytd-app web component.
 * NOTICE: It has been proven modifying this flag has no effect.
 */
function disableIdleTimeout() {
	let ytdApp = document.querySelector('ytd-app');
	if (ytdApp instanceof Element) {
		if (ytdApp.behaviors instanceof Array) {
			ytdApp.behaviors.forEach(behavior => {
				if (behavior.AUTONAV_IDLE_TIMEOUT_ && behavior.AUTONAV_IDLE_TIMEOUT_ !== Number.MAX_SAFE_INTEGER) {
					behavior.AUTONAV_IDLE_TIMEOUT_ = Number.MAX_SAFE_INTEGER;
					console.log('[ANTI-PAUSE] Increased AUTONAV_IDLE_TIMEOUT_');
				}
			});
		}
		if (ytdApp.sendOptionalAction instanceof Function) {
			ytdApp.sendOptionalAction('yt-user-activity');
		} else {
			console.log('[ANTI-PAUSE] sendOptionalAction not called - not a function');
		}
	} else {
		console.log('[ANTI-PAUSE] ytd-app behaviors not found');
	}
}

/**
 * Updates _last property and overwrites getTimeSinceActive() function.
 */
function updateActiveTime() {
	window._lact = Date.now();
	try {
		window.yt.util.activity.getTimeSinceActive = () => Date.now();
	} catch (e) {
		console.log('[ANTI-PAUSE] Unable to replace getTimeSinceActive()');
	}
}

/**
 * Perform hacks each 30 seconds.
 */
setInterval(disableAutoPause, 3000);
setInterval(disableIdleTimeout, 3000);
setInterval(updateActiveTime, 3000);