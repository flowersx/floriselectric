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
			// Clear previous timer
			var prevT = $wrapper.data('rotTimer'); if (prevT) clearTimeout(prevT);
			// NEW baseline alignment fix
			var headlineLineH = $headline.css('line-height');
			$wrapper.css({
				lineHeight: headlineLineH,
				display: 'inline-block',
				verticalAlign: 'baseline',
				overflow: 'visible', // allow descenders
				position: 'relative'
			});
			// Remove any padding/margin previously added
			$wrapper.css({marginTop:'0', paddingTop:'0'});
			// After first word visible, adjust minor vertical offset if needed
			requestAnimationFrame(function(){
				var firstH = $words.eq(0).outerHeight();
				var lineHNum = parseFloat(headlineLineH);
				if(!isNaN(lineHNum) && firstH && Math.abs(lineHNum - firstH) > 2){
					// center the rotating word block within line-height
					var delta = (lineHNum - firstH)/2;
					if (Math.abs(delta) < 20) { // safety clamp
						$wrapper.css('top', delta + 'px');
					}
				}
			});
			// Keep all absolute; hide all first to prevent flash
			$words.removeClass('is-visible is-hidden');
			$words.addClass('is-hidden').attr('aria-hidden','true');
			$words.eq(0).removeClass('is-hidden').addClass('is-visible').attr('aria-hidden','false');
			var currentIndex = 0; var switching=false;
			function switchWord(){
				if (switching) return; switching=true;
				var $current = $words.eq(currentIndex);
				var nextIndex = (currentIndex + 1) % $words.length; var $next = $words.eq(nextIndex);
				$current.attr('aria-hidden','true').removeClass('is-visible').addClass('is-hidden');
				$next.attr('aria-hidden','false').removeClass('is-hidden').addClass('is-visible');
				currentIndex = nextIndex;
				var t = setTimeout(function(){ switching=false; switchWord(); }, animationDelay);
				$wrapper.data('rotTimer', t);
			}
			// start cycle
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
