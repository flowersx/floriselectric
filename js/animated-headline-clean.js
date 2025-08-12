jQuery(document).ready(function($){
	console.log('Animated headline script starting...');
	
	// Simple word rotation for .cd-headline.rotate-1
	var animationDelay = 2500;
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	
	function initWordRotation() {
		$('.cd-headline.rotate-1').each(function() {
			var $headline = $(this);
			var $wrapper = $headline.find('.cd-words-wrapper');
			var $words = $wrapper.find('b');
			
			console.log('Found headline with', $words.length, 'words');
			
			if ($words.length <= 1) return;
			
			// Clear any existing timer
			var existingTimer = $wrapper.data('rotationTimer');
			if (existingTimer) {
				clearInterval(existingTimer);
			}
			
			// Set wrapper minimum width to prevent layout shifts
			var maxWidth = 0;
			$words.each(function() {
				var tempSpan = $('<span>').css({
					'visibility': 'hidden',
					'position': 'absolute',
					'white-space': 'nowrap',
					'font-family': $(this).css('font-family'),
					'font-size': $(this).css('font-size'),
					'font-weight': $(this).css('font-weight')
				}).text($(this).text()).appendTo('body');
				maxWidth = Math.max(maxWidth, tempSpan.width());
				tempSpan.remove();
			});
			$wrapper.css('min-width', maxWidth + 'px');
			
			// Ensure first word is visible, others hidden - force reflow to prevent overlap
			$words.removeClass('is-visible is-hidden');
			$words.eq(0).addClass('is-visible');
			$words.slice(1).addClass('is-hidden');
			
			// Force browser to apply styles before starting animation
			$words[0].offsetHeight;
			
			var currentIndex = 0;
			var isAnimating = false;
			
			function switchWord() {
				if (isAnimating) return;
				isAnimating = true;
				
				if (isIOS) {
					// iOS-specific smooth slide animation (no fade)
					var $current = $words.eq(currentIndex);
					var nextIndex = (currentIndex + 1) % $words.length;
					var $next = $words.eq(nextIndex);
					
					// Prepare next word positioned below
					$next.removeClass('is-hidden').addClass('is-visible').css({
						'transform': 'translateY(100%)',
						'transition': 'none',
						'opacity': '1'
					});
					
					// Force reflow
					$next[0].offsetHeight;
					
					// Start animations simultaneously
					$current.css({
						'transition': 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
						'transform': 'translateY(-100%)'
					});
					
					$next.css({
						'transition': 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
						'transform': 'translateY(0%)'
					});
					
					setTimeout(function() {
						$current.removeClass('is-visible').addClass('is-hidden').css({
							'transition': '',
							'transform': ''
						});
						
						$next.css({
							'transition': '',
							'transform': ''
						});
						
						currentIndex = nextIndex;
						isAnimating = false;
					}, 600);
					
				} else {
					// Original 3D flip animation for desktop/Android
					$words.eq(currentIndex).removeClass('is-visible').addClass('is-hidden');
					currentIndex = (currentIndex + 1) % $words.length;
					
					setTimeout(function() {
						$words.eq(currentIndex).removeClass('is-hidden').addClass('is-visible');
						
						setTimeout(function() {
							isAnimating = false;
						}, isMobile ? 600 : 400);
					}, isMobile ? 50 : 0);
				}
				
				console.log('Switched to word:', currentIndex, $words.eq(currentIndex).text());
			}
			
			// Start rotation
			var timer = setInterval(switchWord, animationDelay);
			$wrapper.data('rotationTimer', timer);
		});
	}
	
	// Initialize when DOM is ready
	initWordRotation();
	
	// Handle page visibility changes
	document.addEventListener('visibilitychange', function() {
		if (document.hidden) {
			// Clear timers when page is hidden
			$('.cd-headline.rotate-1 .cd-words-wrapper').each(function() {
				var timer = $(this).data('rotationTimer');
				if (timer) {
					clearInterval(timer);
				}
			});
		} else {
			// Restart when page becomes visible
			setTimeout(initWordRotation, 100);
		}
	});
});
