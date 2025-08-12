jQuery(document).ready(function($){
    console.log('Animated headline script starting...');

    // Word rotation for .cd-headline.rotate-1
    var animationDelay = 2500;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

            // Set wrapper minimum width and height to prevent layout shifts
            var maxWidth = 0;
            var maxHeight = 0;
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
                maxHeight = Math.max(maxHeight, tempSpan.height());
                tempSpan.remove();
            });
            $wrapper.css({
                'min-width': maxWidth + 'px',
                'min-height': maxHeight + 'px'
            });

            // Ensure first word is visible, others hidden
            $words.removeClass('is-visible is-hidden');
            $words.eq(0).addClass('is-visible');
            $words.slice(1).addClass('is-hidden');

            // Force reflow
            $wrapper[0].offsetHeight;

            var currentIndex = 0;
            var isAnimating = false;

            function switchWord() {
                if (isAnimating) return;
                isAnimating = true;

                // Hide current word
                $words.eq(currentIndex).removeClass('is-visible').addClass('is-hidden');

                // Move to next word
                currentIndex = (currentIndex + 1) % $words.length;

                // Show next word with slight delay for iOS
                setTimeout(function() {
                    $words.eq(currentIndex).removeClass('is-hidden').addClass('is-visible');
                    isAnimating = false;
                    console.log('Switched to word:', currentIndex, $words.eq(currentIndex).text());
                }, isMobile ? 100 : 50);
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