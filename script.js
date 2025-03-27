document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const soundBtn = document.getElementById("soundBtn");
    const subtitle = document.getElementById("subtitle");
    const text = document.getElementById("text");
    const day = document.getElementById("day");
    const imageBox = document.getElementById("imageBox");
    const progressBar = document.getElementById("progressBar");
    const paintIcon = document.getElementById("paintIcon");
    
    // Audio elements
    const audioElements = [
        new Audio("sons/son1.mp3"),
        new Audio("sons/son2.mp3"),
        new Audio("sons/son3.mp3")
    ];
    
    // Ajout du son d'écriture
    const typingSound = new Audio("sons/typing.mp3"); // Assurez-vous d'avoir ce fichier dans votre dossier sons
    
    let soundOn = true;
    let currentSlide = 0;
    let audioContext;
    let typingInterval;
    let currentTypingText = "";

    const slides = [
        { text: "Start...", image: "images/slide0.jpg", effect: "zoomIn", audio: 0, paintIcon: "paint.png" },
        { subtitle: "1. Le Début de la Perte", day: "Lundi - intact", text: "L'atelier de Mark. <br> Les toiles débordent de couleurs vives.", image: "images/slide1.jpg", effect: "zoomIn", audio: 0, paintIcon: "paint.png" },
        { subtitle: "1. Le Début de la Perte", day: "Mardi - l'effacement", text: "Chaque trait me relie à mon âme…<br>Mais aujourd'hui, je sens un vide insidieux.", image: "images/slide2.jpg", effect: "fadeOut", audio: 1, paintIcon: "paint.png" },
        { subtitle: "1. Le Début de la Perte", day: "Mercredi - L'érosion", text: "Sous l'effet du temps, l'encre de sa passion s'efface, laissant derrière elle l'ombre d'un souvenir.", image: "images/slide3.jpg", effect: "fadeIn", audio: 1, paintIcon: "paint.png" },
        { subtitle: "2. La Descente dans la Monochromie", day: "Jeudi", text: "Le monde vidé de sa substance. Tout devient du croquis.", image: "images/slide4.jpg", effect: "crumple", audio: 1, paintIcon: "paint.png" },
        { subtitle: "2. La Descente dans la Monochromie", day: "Vendredi", text: "Mark assis à un café, seul, une bulle vide devant lui.", image: "images/slide5.jpg", effect: "blur", audio: 1, paintIcon: "paint.png" },
        { subtitle: "2. La Descente dans la Monochromie", day: "Samedi", text: "Mark regarde autour de lui, et les dessins deviennent de simples croquis.", image: "images/slide6.jpg", effect: "glitch", audio: 1, paintIcon: "bucket.png" },
        { subtitle: "3. L'Épiphanie", day: "Dimanche - La rencontre", text: "Une personne entre en collision avec Mark dans un café.", image: "images/slide7.jpg", effect: "vibrate", audio: 2, paintIcon: "bucket.png" },
        { subtitle: "3. L'Épiphanie", day: "Lundi - L'éclat de couleur", text: "La tasse de café tombe, et au lieu d'une tâche ordinaire, des éclats de couleur jaillissent.", image: "images/slide8.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "3. L'Épiphanie", day: "Mardi - Le retour des émotions", text: "Mark voit la couleur revenir sur ses mains, son environnement.", image: "images/slide9.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "4. La Renaissance Progressive", day: "Mercredi", text: "Chaque émotion redonne de la couleur à son univers.", image: "images/slide10.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "5. La Renaissance", day: "Jeudi - L'apogée", text: "Le studio de Mark, entièrement coloré et vivant.", image: "images/slide11.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "5. La Renaissance", day: "Vendredi - L'artiste accompli", text: "Mark, souriant, entouré de ses œuvres.", image: "images/slide12.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "6. Une Vie Colorée à Deux", day: "Samedi - Le quotidien transformé", text: "Mark et son nouveau compagnon dans son studio, travaillant ensemble, une palette de couleurs vibrantes les entourant.", image: "images/slide13.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "6. Une Vie Colorée à Deux", day: "Dimanche - Un matin rempli de lumière", text: "Mark et son partenaire travaillent ensemble, un rayon de soleil baignant la pièce.", image: "images/slide14.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" },
        { subtitle: "6. Une Vie Colorée à Deux", day: "Lundi - Inspiration partagée", text: "Les mains de Mark et de son partenaire esquissant un dessin ensemble.", image: "images/slide15.jpg", effect: "colorSpread", audio: 2, paintIcon: "paint.png" }
    ];

    // Fonction pour afficher le texte progressivement
    function typeWriter(element, text, speed = 30) {
        // Arrêter l'effet en cours s'il y en a un
        clearInterval(typingInterval);
        if (typingSound) typingSound.pause();
        
        let i = 0;
        element.innerHTML = ""; // Effacer le contenu actuel
        
        // Démarrer le son d'écriture si le son est activé
        if (soundOn && typingSound) {
            typingSound.currentTime = 0;
            typingSound.loop = true;
            typingSound.play().catch(e => console.log("Typing sound play failed:", e));
        }
        
        typingInterval = setInterval(() => {
            if (i < text.length) {
                // Ajouter le caractère suivant
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                // Arrêter l'animation et le son quand c'est fini
                clearInterval(typingInterval);
                if (typingSound) typingSound.pause();
            }
        }, speed);
    }

    // Preload images
    function preloadImages() {
        slides.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
        });
    }

    // Update slide content
    function updateSlide() {
        const slide = slides[currentSlide];
        subtitle.textContent = slide.subtitle || "";
        day.textContent = slide.day || "";
        
        // Utiliser l'effet de machine à écrire pour le texte principal
        typeWriter(text, slide.text);
        
        imageBox.style.backgroundImage = `url(${slide.image})`;
        
        // Update paint button icon
        if (slide.paintIcon) {
            paintIcon.src = `images/${slide.paintIcon}`;
        }
        
        // Update progress bar
        progressBar.style.width = `${(currentSlide / (slides.length - 1)) * 100}%`;
        
        applyEffect(slide.effect);
        updateBackgroundColor();
        playAudio(slide.audio);
    }

    function updateBackgroundColor() {
        document.body.className = currentSlide >= slides.length - 3
            ? `bg-color-${currentSlide - slides.length + 4}`
            : "";
    }

    // Apply visual effect
    function applyEffect(effect) {
        // Reset classes
        imageBox.className = "image-box";
        
        // Add new effect
        if (effect) {
            imageBox.classList.add(effect);
            
            // Remove effect class after animation completes
            setTimeout(() => {
                imageBox.classList.remove(effect);
            }, 2000);
        }
    }

    // Update background color
    function updateBackgroundColor() {
        document.body.className = "";
        if (currentSlide >= slides.length - 3) {
            document.body.classList.add(`bg-color-${currentSlide - slides.length + 4}`);
        }
    }

    // Play audio
    function playAudio(index) {
        if (!soundOn || index === undefined) return;
        
        // Stop all audio first
        audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Play selected audio
        audioElements[index].play().catch(e => console.log("Audio play failed:", e));
    }

    // Toggle sound
    function toggleSound() {
        soundOn = !soundOn;
        
        if (soundOn) {
            playAudio(slides[currentSlide].audio);
            soundBtn.querySelector("img").src = "images/sonon.png";
        } else {
            audioElements.forEach(audio => audio.pause());
            if (typingSound) typingSound.pause();
            soundBtn.querySelector("img").src = "images/sonoff.png";
        }
    }

    // Navigate between slides
    function navigateSlide(step) {
        const newSlide = currentSlide + step;
        if (newSlide >= 0 && newSlide < slides.length) {
            currentSlide = newSlide;
            updateSlide();
        }
    }

    // Initialize audio context on first interaction
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioElements.forEach(audio => {
                const source = audioContext.createMediaElementSource(audio);
                source.connect(audioContext.destination);
            });
            // Initialiser aussi pour le son d'écriture
            if (typingSound) {
                const typingSource = audioContext.createMediaElementSource(typingSound);
                typingSource.connect(audioContext.destination);
            }
        }
    }

    // Event listeners
    prevBtn.addEventListener("click", () => navigateSlide(-1));
    nextBtn.addEventListener("click", () => navigateSlide(1));
    soundBtn.addEventListener("click", toggleSound);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") navigateSlide(-1);
        else if (event.key === "ArrowRight") navigateSlide(1);
    });

    // Initialize
    document.body.addEventListener("click", initAudio, { once: true });
    preloadImages();
    updateSlide();
});

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});