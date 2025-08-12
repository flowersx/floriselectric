jQuery(document).ready(function($){
	console.log('Universal animated headline starting...');
	
	// Configuration
	var config = {
		delay: 2500,           // Time between word changes
		animDuration: 800,     // Animation duration
		animEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
		isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	};
	
	// Global timer management to prevent overlapping
	var globalAnimationState = {
		isAnimating: false,
		timers: [],
		lastSwitchTime: 0
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
		
		// Ensure parent headline maintains proper display context
		var $headline = $wrapper.closest('.cd-headline.rotate-1');
		$headline.css('align-items', 'center');
	}
	
	function initializeWords($words) {
		// Reset all classes and styles
		$words.removeClass('is-visible is-hidden animate-in animate-out');
		
		// Set initial positions with more robust transforms
		$words.each(function(index) {
			$(this).css({
				position: 'absolute',
				top: '0',
				left: '50%',
				width: '100%',
				opacity: index === 0 ? '1' : '0',
				transform: index === 0 ? 'translateX(-50%) translateY(0%) scale(1)' : 'translateX(-50%) translateY(120%) scale(0.9)',
				transition: 'none',
				zIndex: index === 0 ? '2' : '1'
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
				transition: `opacity ${config.animDuration}ms ${config.animEasing}, transform ${config.animDuration}ms ${config.animEasing}, z-index 0ms`
			});
		}, 50);
	}
	
	function startAnimationCycle($wrapper, $words) {
		var currentIndex = 0;
		
		function switchToNextWord() {
			if (globalAnimationState.isAnimating || $words.length <= 1) return;
			
			// Prevent rapid consecutive switches
			var now = Date.now();
			if (now - globalAnimationState.lastSwitchTime < config.delay - 100) {
				console.log('Preventing rapid switch, time since last:', now - globalAnimationState.lastSwitchTime);
				return;
			}
			
			globalAnimationState.isAnimating = true;
			globalAnimationState.lastSwitchTime = now;
			
			var $current = $words.eq(currentIndex);
			var nextIndex = (currentIndex + 1) % $words.length;
			var $next = $words.eq(nextIndex);
			
			// Clear any existing timer for this wrapper
			var existingTimer = $wrapper.data('animTimer');
			if (existingTimer) {
				clearTimeout(existingTimer);
				$wrapper.removeData('animTimer');
			}
			
			console.log('Starting animation from word', currentIndex, 'to', nextIndex);
			
			// Clear all classes and reset transforms before starting
			$words.removeClass('is-visible is-hidden animate-in animate-out');
			
			// Set initial positions with consistent transforms
			$current.addClass('is-visible').css({
				opacity: '1',
				transform: 'translateX(-50%) translateY(0%) scale(1)',
				zIndex: '3'
			});
			
			$next.addClass('is-hidden').css({
				opacity: '0',
				transform: 'translateX(-50%) translateY(120%) scale(0.9)',
				zIndex: '1'
			});
			
			// Force reflow
			$next[0].offsetHeight;
			
			// Start animations with proper state classes
			setTimeout(function() {
				if (!globalAnimationState.isAnimating) return;
				
				// Animate out current word
				$current.removeClass('is-visible').addClass('animate-out').css({
					opacity: '0',
					transform: 'translateX(-50%) translateY(-60%) scale(0.95)',
					zIndex: '3'
				});
				
				// Animate in next word
				$next.removeClass('is-hidden').addClass('animate-in').css({
					opacity: '1',
					transform: 'translateX(-50%) translateY(0%) scale(1)',
					zIndex: '2'
				});
				
			}, 50);
			
			// Clean up after animation completes
			setTimeout(function() {
				// Clear all animation classes
				$words.removeClass('animate-in animate-out');
				
				// Set final states
				$current.addClass('is-hidden').css({
					opacity: '0',
					transform: 'translateX(-50%) translateY(120%) scale(0.9)',
					zIndex: '1'
				});
				
				$next.addClass('is-visible').css({
					opacity: '1',
					transform: 'translateX(-50%) translateY(0%) scale(1)',
					zIndex: '2'
				});
				
				currentIndex = nextIndex;
				globalAnimationState.isAnimating = false;
				
				// Schedule next switch with guaranteed delay
				var timer = setTimeout(function() {
					switchToNextWord();
				}, config.delay);
				
				$wrapper.data('animTimer', timer);
				globalAnimationState.timers.push(timer);
				
				console.log('Animation completed, scheduling next in:', config.delay + 'ms');
				
			}, config.animDuration + 150); // Extended buffer for mobile
		}
		
		// Start the cycle with initial delay
		var initialTimer = setTimeout(function() {
			switchToNextWord();
		}, config.delay);
		
		$wrapper.data('animTimer', initialTimer);
		globalAnimationState.timers.push(initialTimer);
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
			// Pause animations and clear all timers
			globalAnimationState.isAnimating = false;
			globalAnimationState.timers.forEach(function(timer) {
				clearTimeout(timer);
			});
			globalAnimationState.timers = [];
			
			$('.cd-words-wrapper').each(function() {
				var timer = $(this).data('animTimer');
				if (timer) {
					clearTimeout(timer);
					$(this).removeData('animTimer');
				}
			});
		} else {
			// Resume animations
			setTimeout(function() {
				globalAnimationState.isAnimating = false;
				globalAnimationState.timers = [];
				initHeadlineAnimation();
			}, 200);
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