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
    typeWriterAnimation(textElement, texts);
}

window.onload = function () {
    var menuToggle = document.querySelector(".menu-toggle")
    var navbarMenu = document.querySelector(".navbar-menu")

    menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("menu-down")
        navbarMenu.classList.toggle("menu-down")
    })

    startTypeWriterAnimationOn(document.querySelector(".typewriter"));
};
