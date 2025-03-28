import { slides } from './config.js';

export class SlideManager {
    constructor() {
        this.currentSlide = 0;
        this.typingInterval = null;
    }

    preloadImages() {
        slides.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
        });
    }

    typeWriter(element, text, speed = 30, onTyping, onComplete) {
        clearInterval(this.typingInterval);
        if (onTyping) onTyping();
        
        let i = 0;
        element.innerHTML = "";
        
        this.typingInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typingInterval);
                if (onComplete) onComplete();
            }
        }, speed);
    }

    navigate(step) {
        const newSlide = this.currentSlide + step;
        if (newSlide >= 0 && newSlide < slides.length) {
            this.currentSlide = newSlide;
            return slides[this.currentSlide];
        }
        return null;
    }

    getCurrentSlide() {
        return slides[this.currentSlide];
    }

    getProgress() {
        return (this.currentSlide / (slides.length - 1)) * 100;
    }

    shouldUpdateBackground() {
        return this.currentSlide >= slides.length - 3;
    }

    getBackgroundClass() {
        return `bg-color-${this.currentSlide - slides.length + 4}`;
    }
}