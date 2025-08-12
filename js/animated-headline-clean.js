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

			// Revert any prior iOS absolute forcing for layout consistency
			$words.each(function(){ this.style.position=''; this.style.transform=''; this.style.opacity=''; });
			$wrapper.css({display:'inline-block', position:'relative'});

			$words.removeClass('is-visible is-hidden');
			$words.addClass('is-hidden').attr('aria-hidden','true');
			$words.eq(0).removeClass('is-hidden').addClass('is-visible').attr('aria-hidden','false');

			var currentIndex = 0; var switching = false;
			var useIOSFallback = (typeof _isIOS !== 'undefined' && _isIOS);

			function cssKeyframeSwitch(){
				if (switching) return; switching = true;
				var $current = $words.eq(currentIndex);
				var nextIndex = (currentIndex + 1) % $words.length; var $next = $words.eq(nextIndex);
				$current.attr('aria-hidden','true').removeClass('is-visible').addClass('is-hidden');
				$next.attr('aria-hidden','false').removeClass('is-hidden').addClass('is-visible');
				currentIndex = nextIndex;
				var t = setTimeout(function(){ switching=false; schedule(); }, animationDelay);
				$wrapper.data('rotTimer', t);
			}

			function iosFallbackSwitch(){
				if (switching) return; switching = true;
				var $current = $words.eq(currentIndex);
				var nextIndex = (currentIndex + 1) % $words.length; var $next = $words.eq(nextIndex);
				// Prepare next
				$next.attr('aria-hidden','false');
				$next.removeClass('is-hidden is-visible'); // remove classes to avoid keyframes
				$next.css({position:'absolute', left:0, top:0, transform:'rotateX(90deg)', opacity:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden'});
				$current.css({position:'absolute', left:0, top:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden'});
				$wrapper.css('height', Math.max($wrapper.height(), $current.outerHeight(), $next.outerHeight())+'px');
				// Force reflow
				void $next[0].offsetHeight;
				// Animate via JS (transition inline)
				$current.css({transition:'transform 0.6s ease, opacity 0.6s ease', transform:'rotateX(-90deg)', opacity:0});
				$next.css({transition:'transform 0.6s ease, opacity 0.6s ease', transform:'rotateX(0deg)', opacity:1});
				setTimeout(function(){
					$current.addClass('is-hidden').removeAttr('style').attr('aria-hidden','true');
					$next.addClass('is-visible').removeAttr('style');
					currentIndex = nextIndex; switching=false; schedule();
				}, 620);
			}

			function schedule(){
				var t = setTimeout(function(){ useIOSFallback ? iosFallbackSwitch() : cssKeyframeSwitch(); }, animationDelay);
				$wrapper.data('rotTimer', t);
			}
			schedule();
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
