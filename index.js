function typeWriterAnimation(textElement, texts) {
    var typeSpeed = 40;
    var blinkSpeed = 600;

    var cursor = "\u23B8"
    var txt = cursor + texts[0] + cursor;
    textElement.textContent = "";

    var chars = txt.split("");
    var charElements = chars.map((c) => {
        let element = document.createElement('span');
        element.textContent = c;
        element.style.opacity = 0;
        textElement.appendChild(element)
        return element;
    });

    function blink(numberOfBlinks, charElement, continuation) {
        function on() {
            charElement.style.opacity = 1;
            setTimeout(off, blinkSpeed)
        }

        function off() {
            charElement.style.opacity = 0;
            numberOfBlinks--;
            if (numberOfBlinks > 0) {
                setTimeout(on, blinkSpeed);
            } else if (continuation) {
                continuation()
            }
        }
        charElement.textContent = cursor;
        on()
    };

    function typeWriter(i) {
        if (i < charElements.length - 1) {
            charElements[i].textContent = txt[i]
            charElements[i].style.opacity = 1;
            setTimeout(() => typeWriter(i + 1), typeSpeed);
        } else {
            blink(5, charElements.at(-1), next);
        }
    };

    function next() {
        typeWriterAnimation(textElement, [...texts.slice(1), texts.at(0)])
    }

    blink(1, charElements[1], () => { typeWriter(1) });
};

function startTypeWriterAnimationOn(textElement) {
    var texts = textElement.textContent.trim().split("\n").map((s) => s.trim());
    textElement.style.opacity = 1;
    typeWriterAnimation(textElement, texts);
}

function initScroller() {
    const resetDuration = 600;
    const sections = document.querySelectorAll("section");

    let animating = false;
    let sectionIndex = 0;

    function clampIndex(index) {
        return Math.max(0, Math.min(sections.length - 1, index))
    }

    function handleScroll(offset) {
        let sectionsStyle = window.getComputedStyle(document.querySelector('.sections-wrapper'));
        if (sectionsStyle.overflow === 'scroll') {
            return
        }

        if (!animating) {
            sectionIndex = clampIndex(sectionIndex + offset);
            scrollTo(sections[sectionIndex]);
        }
    }

    function handleOnWheel(event) {
        handleScroll(-Math.sign(event.wheelDelta));
        event.preventDefault()
    }

    let initialTouchY;

    function handleTouchStart(event) {
        initialTouchY = event.touches[0].clientY;
    }

    function handleTouchEnd(event) {
        const deltaY = initialTouchY - event.changedTouches[0].clientY; // down = positive

        if (Math.abs(deltaY) > 10) {
            handleScroll(Math.sign(deltaY));
        }
    }

    function handleArrowKeys(event) {
        if (event.key == 'ArrowUp') {
            handleScroll(-1);
            event.preventDefault()
        }
        else if (event.key == 'ArrowDown') {
            handleScroll(1);
            event.preventDefault()
        }
    }

    function scrollTo(target) {
        animating = true;
        target.scrollIntoView({behavior: 'smooth', alignToTop: true})
        setTimeout(() => {
            animating = false;
        }, resetDuration)
    }

    document.addEventListener('wheel', handleOnWheel, {passive: false});
    document.addEventListener('touchstart', handleTouchStart, {passive: false})
    document.addEventListener('touchend', handleTouchEnd, {passive: false})
    document.addEventListener('keydown', handleArrowKeys, {passive: false})
}

// compute and store section height on mobile
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

window.onload = function () {
    initScroller()
    startTypeWriterAnimationOn(document.querySelector(".typewriter"));
};
