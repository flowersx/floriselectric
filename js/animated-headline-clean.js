jQuery(document).ready(function($){
	console.log('Universal animated headline starting...');
	
	// Configuration
	var config = {
		delay: 2500,           // Time between word changes
		animDuration: 800,     // Animation duration
		animEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
		isMobile: window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	};
	
	function initHeadlineAnimation() {
		$('.cd-headline.rotate-1').each(function() {
			var $headline = $(this);
			var $wrapper = $headline.find('.cd-words-wrapper');
			var $words = $wrapper.find('b');
			
			if ($words.length <= 1) return;
			
			// Clear existing timers
			var timer = $wrapper.data('animTimer');
			if (timer) clearTimeout(timer);
			
			// Measure and set optimal wrapper dimensions
			setupWrapperDimensions($wrapper, $words);
			
			// Initialize word states
			initializeWords($words);
			
			// Start animation cycle
			startAnimationCycle($wrapper, $words);
			
			console.log('Initialized animation for', $words.length, 'words');
		});
	}
	
	function setupWrapperDimensions($wrapper, $words) {
		// Create temporary measurement elements
		var $measurer = $('<div>').css({
			position: 'absolute',
			visibility: 'hidden',
			whiteSpace: 'nowrap',
			fontSize: $words.first().css('fontSize'),
			fontFamily: $words.first().css('fontFamily'),
			fontWeight: $words.first().css('fontWeight'),
			lineHeight: $words.first().css('lineHeight')
		}).appendTo('body');
		
		var maxWidth = 0;
		var maxHeight = 0;
		
		$words.each(function() {
			$measurer.text($(this).text());
			maxWidth = Math.max(maxWidth, $measurer.outerWidth());
			maxHeight = Math.max(maxHeight, $measurer.outerHeight());
		});
		
		$measurer.remove();
		
		// Set wrapper dimensions to prevent layout shifts
		$wrapper.css({
			minWidth: maxWidth + 'px',
			height: maxHeight + 'px',
			position: 'relative',
			display: 'inline-block',
			overflow: 'hidden',
			verticalAlign: 'baseline'
		});
	}
	
	function initializeWords($words) {
		// Reset all classes and styles
		$words.removeClass('is-visible is-hidden animate-in animate-out');
		
		// Set initial positions
		$words.each(function(index) {
			$(this).css({
				position: 'absolute',
				top: '0',
				left: '0',
				opacity: index === 0 ? '1' : '0',
				transform: index === 0 ? 'translateY(0%) scale(1)' : 'translateY(100%) scale(0.95)',
				transition: 'none'
			});
			
			if (index === 0) {
				$(this).addClass('is-visible');
			} else {
				$(this).addClass('is-hidden');
			}
		});
		
		// Force reflow
		$words[0].offsetHeight;
		
		// Enable transitions after initial setup
		setTimeout(function() {
			$words.css({
				transition: `opacity ${config.animDuration}ms ${config.animEasing}, transform ${config.animDuration}ms ${config.animEasing}`
			});
		}, 50);
	}
	
	function startAnimationCycle($wrapper, $words) {
		var currentIndex = 0;
		var isAnimating = false;
		
		function switchToNextWord() {
			if (isAnimating || $words.length <= 1) return;
			
			isAnimating = true;
			var $current = $words.eq(currentIndex);
			var nextIndex = (currentIndex + 1) % $words.length;
			var $next = $words.eq(nextIndex);
			
			// Start exit animation for current word
			$current.removeClass('is-visible').addClass('animate-out').css({
				opacity: '0',
				transform: 'translateY(-50%) scale(0.95)'
			});
			
			// Prepare next word
			$next.removeClass('is-hidden').addClass('animate-in').css({
				opacity: '0',
				transform: 'translateY(100%) scale(0.95)'
			});
			
			// Small delay then animate in the next word
			setTimeout(function() {
				$next.css({
					opacity: '1',
					transform: 'translateY(0%) scale(1)'
				});
			}, 100);
			
			// Clean up after animation completes
			setTimeout(function() {
				$current.removeClass('animate-out').addClass('is-hidden').css({
					transform: 'translateY(100%) scale(0.95)'
				});
				
				$next.removeClass('animate-in').addClass('is-visible');
				
				currentIndex = nextIndex;
				isAnimating = false;
				
				// Schedule next switch
				var timer = setTimeout(switchToNextWord, config.delay);
				$wrapper.data('animTimer', timer);
				
			}, config.animDuration);
		}
		
		// Start the cycle
		var initialTimer = setTimeout(switchToNextWord, config.delay);
		$wrapper.data('animTimer', initialTimer);
	}
	
	// Handle responsive changes
	function handleResize() {
		config.isMobile = window.innerWidth <= 768;
		// Reinitialize on significant resize
		clearTimeout(window.resizeTimeout);
		window.resizeTimeout = setTimeout(function() {
			initHeadlineAnimation();
		}, 300);
	}
	
	// Handle page visibility
	function handleVisibilityChange() {
		if (document.hidden) {
			// Pause animations
			$('.cd-words-wrapper').each(function() {
				var timer = $(this).data('animTimer');
				if (timer) clearTimeout(timer);
			});
		} else {
			// Resume animations
			setTimeout(initHeadlineAnimation, 200);
		}
	}
	
	// Initialize
	initHeadlineAnimation();
	
	// Event listeners
	$(window).on('resize', handleResize);
	document.addEventListener('visibilitychange', handleVisibilityChange);
	
	// Reinitialize on orientation change (mobile)
	window.addEventListener('orientationchange', function() {
		setTimeout(initHeadlineAnimation, 500);
	});
});