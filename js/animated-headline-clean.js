jQuery(document).ready(function($){
	// Add a 'js' class early for CSS control
	if(!document.documentElement.classList.contains('js')){
	  document.documentElement.classList.add('js');
	}

	console.log('Animated headline script starting...');
	
	// Simple word rotation for .cd-headline.rotate-1
	var animationDelay = 2500; // keep same delay between word changes
	
	// NEW: avoid multiple timers per wrapper
	function initWordRotation() {
		$('.cd-headline.rotate-1').each(function() {
			var $headline = $(this);
			var $wrapper = $headline.find('.cd-words-wrapper');
			var $words = $wrapper.find('b');
			
			console.log('Found headline with', $words.length, 'words');
			
			if ($words.length <= 1) return;

			// Clear any previous timer stored
			var prevT = $wrapper.data('rotTimer');
			if (prevT) { clearTimeout(prevT); }

			// Measure tallest word to lock wrapper height (prevents jump + overlap flash)
			var maxH = 0; $words.each(function(){ var h = $(this).outerHeight(); if(h>maxH) maxH=h; });
			$wrapper.css('height', maxH + 'px');

			// Force all hidden except first BEFORE repaint to avoid initial overlap flash
			$words.removeClass('is-visible is-hidden');
			$words.not(':first').addClass('is-hidden').attr('aria-hidden','true');
			$words.eq(0).addClass('is-visible').attr('aria-hidden','false');

			var currentIndex = 0;
			var animDuration = 1200; // matches CSS keyframes (1.2s)
			var switching = false;

			function switchWord() {
				if (switching) return; // guard in case of lag
				switching = true;
				var $current = $words.eq(currentIndex);
				var nextIndex = (currentIndex + 1) % $words.length;
				var $next = $words.eq(nextIndex);
				// Update aria-hidden for accessibility
				$current.attr('aria-hidden','true');
				$next.attr('aria-hidden','false');
				// Trigger animations (CSS handles timing)
				$current.removeClass('is-visible').addClass('is-hidden');
				$next.removeClass('is-hidden').addClass('is-visible');
				currentIndex = nextIndex;
				// Schedule next switch after delay - animation already overlaps nicely
				var t = setTimeout(function(){ switching = false; switchWord(); }, animationDelay);
				$wrapper.data('rotTimer', t);
			}

			// Start first cycle after full visible delay so user reads first word
			var startTimer = setTimeout(function(){ switchWord(); }, animationDelay);
			$wrapper.data('rotTimer', startTimer);
		});
	}
	
	// Initialize when DOM is ready
	initWordRotation();

	// Pause when tab hidden to keep timing in sync
	document.addEventListener('visibilitychange', function(){
		$('.cd-headline.rotate-1 .cd-words-wrapper').each(function(){
			var t = $(this).data('rotTimer');
			if (t) clearTimeout(t);
		});
		if (!document.hidden) {
			initWordRotation();
		}
	});
});
