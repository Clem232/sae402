import { slides, audioFiles, typingSoundFile } from './config.js'; 
import { AudioManager } from './audio-manager.js';
import { SlideManager } from './slide-manager.js';
import { EffectsManager } from './effects-manager.js';
import { initCursor } from './cursor.js';
import { ProgressBar } from './progress-bar.js';
import { SplashEffect } from './splash-effect.js'; // Importation de l'effet Splash
import { ScratchEffect } from './scratch-effect.js'; // Importation de l'effet Scratch

document.addEventListener("DOMContentLoaded", () => {
    // Initialisation des éléments DOM
    const DOM = {
        prevBtn: document.getElementById("prevBtn"),
        nextBtn: document.getElementById("nextBtn"),
        soundBtn: document.getElementById("soundBtn"),
        subtitle: document.getElementById("subtitle"),
        text: document.getElementById("text"),
        day: document.getElementById("day"),
        imageBox: document.getElementById("imageBox"),
        paintIcon: document.getElementById("paintIcon"),
        paintBtn: document.getElementById("paintBtn")
    };

    // Initialisation des modules
    const audioManager = new AudioManager(audioFiles, typingSoundFile);
    const slideManager = new SlideManager(slides);
    const progressBar = new ProgressBar(slides.length);
    const splashEffect = new SplashEffect(); // Initialisation de l'effet splash
    const scratchEffect = new ScratchEffect(); // Initialisation de l'effet scratch
    initCursor();

    // Fonction pour créer les cercles animés
    function createAnimatedCircles() {
        const container = document.createElement('div');
        container.className = 'animated-circles';
        
        const colors = ['#ff3366', '#33ff66', '#3366ff', '#ff33ff', '#33ffff', '#ffff33'];
        const sizes = [200, 300, 250, 350, 400];
        
        for (let i = 0; i < 8; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.background = color;
            circle.style.left = `${Math.random() * 100}%`;
            circle.style.top = `${Math.random() * 100}%`;
            circle.style.animationDuration = `${15 + Math.random() * 15}s`;
            circle.style.animationDelay = `-${Math.random() * 15}s`;
            
            container.appendChild(circle);
        }
        
        document.body.appendChild(container);
        return container;
    }

    // Fonction principale de mise à jour
    function updateSlide() {
        const slide = slideManager.getCurrentSlide();
        
        // Mise à jour du contenu
        DOM.subtitle.textContent = slide.subtitle || "";
        DOM.day.textContent = slide.day || "";
        
        // Effet machine à écrire
        slideManager.typeWriter(
            DOM.text, 
            slide.text,
            30,
            () => audioManager.startTypingSound(),
            () => audioManager.stopTypingSound()
        );
        
        // Mise à jour de l'image
        DOM.imageBox.style.backgroundImage = `url(${slide.image})`;
        
        // Icône paint
        DOM.paintIcon.src = `images/${slide.paintIcon}`;
        
        // Effets visuels
        EffectsManager.applyEffect(DOM.imageBox, slide.effect);
        updateBackground();
        
        // Audio et progression
        audioManager.playAudio(slide.audio);
        progressBar.update(slideManager.currentSlide);
        
        // Gestion spéciale pour la première slide
        if (slideManager.currentSlide === 0) {
            DOM.imageBox.style.display = 'none';
            if (!document.querySelector('.animated-circles')) {
                createAnimatedCircles();
            }
        } else {
            DOM.imageBox.style.display = 'block';
            const circles = document.querySelector('.animated-circles');
            if (circles) circles.remove();
        }

        // Gestion spéciale pour les slides avec bucket.png
        if (slide.paintIcon === "bucket.png") {
            // Changer l'icône
            DOM.paintIcon.src = `images/${slide.paintIcon}`;
            
            // Délai pour que l'image soit chargée avant l'effet
            setTimeout(() => {
                splashEffect.createSplashes(20); // 20 taches de couleur
            }, 100);
        }
    }

    // Gestion du fond d'écran
    function updateBackground() {
        document.body.className = slideManager.shouldUpdateBackground() 
            ? slideManager.getBackgroundClass() 
            : "";
    }

    // Navigation
    function navigate(direction) {
        if (slideManager.navigate(direction)) {
            updateSlide();
            return true;
        }
        return false;
    }

    // Gestion des événements
    function setupEventListeners() {
        DOM.prevBtn.addEventListener("click", () => navigate(-1));
        DOM.nextBtn.addEventListener("click", () => navigate(1));
        
        DOM.soundBtn.addEventListener("click", () => {
            DOM.soundBtn.querySelector("img").src = audioManager.toggleSound();
        });
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") navigate(-1);
            if (e.key === "ArrowRight") navigate(1);
        });
        
        document.body.addEventListener("click", () => {
            audioManager.initAudioContext();
        }, { once: true });
        
        DOM.paintBtn.addEventListener("click", () => {
            const currentSlide = slideManager.getCurrentSlide();
            
            // Vérifier si l'icône actuelle est bucket.png
            if (currentSlide.paintIcon === "bucket.png") {
                splashEffect.createSplashes(25);
                // Changer directement l'image pour les slides avec bucket
                DOM.imageBox.style.backgroundImage = `url(${currentSlide.image.replace('images/', 'images/colo/')})`;
            } else {
                scratchEffect.createScratchOverlay(currentSlide);
            }
        });
    }

    // Initialisation
    function init() {
        setupEventListeners();
        slideManager.preloadImages();
        updateSlide();
    }

    init();
});
