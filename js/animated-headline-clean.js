jQuery(document).ready(function($){
	// Add a 'js' class early for CSS control
	if(!document.documentElement.classList.contains('js')){
	  document.documentElement.classList.add('js');
	}
	// iOS detection for animation tweak
	var _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	if(_isIOS){ document.documentElement.classList.add('ios-fix'); }

	console.log('Animated headline script starting...');
	
	// Simple word rotation for .cd-headline.rotate-1
	var animationDelay = 2500; // keep same delay between word changes
	function initWordRotation() {
		$('.cd-headline.rotate-1').each(function() {
			var $headline = $(this);
			var $wrapper = $headline.find('.cd-words-wrapper');
			var $words = $wrapper.find('b');
			if ($words.length <= 1) return;
			var prevT = $wrapper.data('rotTimer'); if (prevT) clearTimeout(prevT);

			// 1) LOCK WRAPPER HEIGHT ONCE (prevents jump but keeps baseline by NOT translating)
			if(!$wrapper.data('lockH')){
				var maxH = 0; $words.each(function(){ maxH = Math.max(maxH, $(this).outerHeight()); });
				$wrapper.css({height:maxH+'px', display:'inline-block', verticalAlign:'baseline', position:'relative'}).data('lockH', true);
			}

			// 2) iOS: FORCE ABSOLUTE FOR VISIBLE WORD TOO (avoid layout reflow when class toggles)
			if (typeof _isIOS !== 'undefined' && _isIOS) {
				$words.css({position:'absolute'}); // all stacked
			}

			// 3) RESET CLASSES
			$words.removeClass('is-visible is-hidden');
			$words.addClass('is-hidden').attr('aria-hidden','true');
			$words.eq(0).removeClass('is-hidden').addClass('is-visible').attr('aria-hidden','false');

			var currentIndex = 0; var switching = false;
			function switchWord(){
				if (switching) return; switching = true;
				var $current = $words.eq(currentIndex);
				var nextIndex = (currentIndex + 1) % $words.length; var $next = $words.eq(nextIndex);
				$current.attr('aria-hidden','true').removeClass('is-visible').addClass('is-hidden');
				$next.attr('aria-hidden','false').removeClass('is-hidden').addClass('is-visible');
				currentIndex = nextIndex;
				var t = setTimeout(function(){ switching=false; switchWord(); }, animationDelay);
				$wrapper.data('rotTimer', t);
			}
			var startTimer = setTimeout(function(){ switchWord(); }, animationDelay);
			$wrapper.data('rotTimer', startTimer);
		});
	}
	
	// Initialize when DOM is ready
	initWordRotation();

	// Pause when tab hidden to keep timing in sync
	document.addEventListener('visibilitychange', function(){
		$('.cd-headline.rotate-1 .cd-words-wrapper').each(function(){ var t=$(this).data('rotTimer'); if(t) clearTimeout(t); });
		if(!document.hidden){ initWordRotation(); }
	});
});
