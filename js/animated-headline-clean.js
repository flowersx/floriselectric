jQuery(document).ready(function($){
	console.log('Animated headline script starting...');
	
	// Simple word rotation for .cd-headline.rotate-1
	var animationDelay = 2500;
	
	function initWordRotation() {
		$('.cd-headline.rotate-1').each(function() {
			var $headline = $(this);
			var $wrapper = $headline.find('.cd-words-wrapper');
			var $words = $wrapper.find('b');
			
			console.log('Found headline with', $words.length, 'words');
			
			if ($words.length <= 1) return;
			
			// Ensure first word is visible, others hidden
			$words.removeClass('is-visible is-hidden');
			$words.eq(0).addClass('is-visible');
			$words.slice(1).addClass('is-hidden');
			
			var currentIndex = 0;
			
			function switchWord() {
				// Hide current word
				$words.eq(currentIndex).removeClass('is-visible').addClass('is-hidden');
				
				// Move to next word
				currentIndex = (currentIndex + 1) % $words.length;
				
				// Show next word
				$words.eq(currentIndex).removeClass('is-hidden').addClass('is-visible');
				
				console.log('Switched la cuvantul:', currentIndex, $words.eq(currentIndex).text());
			}
			
			// Start rotation
			setInterval(switchWord, animationDelay);
		});
	}
	
	// Initialize when DOM is ready
	initWordRotation();
});
