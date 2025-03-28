export class ProgressBar {
    constructor(totalSlides) {
        this.progressBar = document.getElementById('progressBar');
        this.totalSlides = totalSlides;
        this.initStyles();
    }

    initStyles() {
        // Style de base
        this.progressBar.style.cssText = `
            height: 100%;
            transition: width 0.5s ease, background-color 0.5s ease;
            border-radius: 5px;
        `;
    }

    update(currentSlide) {
        const percentage = (currentSlide / (this.totalSlides - 1)) * 100;
        this.progressBar.style.width = `${percentage}%`;
        this.updateAppearance(percentage);
    }

    updateAppearance(percentage) {
        if (percentage < 25) {
            this.progressBar.style.backgroundColor = '#555';
        } 
        else if (percentage < 50) {
            this.progressBar.style.backgroundColor = '#4a6da7';
        } 
        else if (percentage < 75) {
            this.progressBar.style.backgroundColor = '#8a2be2';
        } 
        else {
            this.progressBar.style.backgroundColor = '#CCF4DC';
            if (percentage > 90) {
                this.progressBar.style.boxShadow = '0 0 8px rgba(0, 229, 255, 0.7)';
            }
        }
    }
}