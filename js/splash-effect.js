export class SplashEffect {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'color-splashes';
        document.body.appendChild(this.container);
        this.splashSound = new Audio("sons/bucket-splash.mp3"); // Son spécifique pour bucket
        this.colors = [
            '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
            '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
            '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
            '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
        ];
    }

    createSplashes(count = 20) {
        this.container.innerHTML = '';
        this.container.style.display = 'block';
        
        // Jouer le son
        this.splashSound.currentTime = 0;
        this.splashSound.play().catch(e => console.log("Splash sound error:", e));
        
        // Créer des formes organiques (pas que des cercles)
        for (let i = 0; i < count; i++) {
            const splash = document.createElement('div');
            splash.className = 'color-splash';
            
            const size = 50 + Math.random() * 150;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const shape = Math.random() > 0.3 ? 'circle' : 'organic';
            
            splash.style.width = `${size}px`;
            splash.style.height = `${size}px`;
            splash.style.background = color;
            splash.style.left = `${Math.random() * 100}%`;
            splash.style.top = `${Math.random() * 100}%`;
            splash.style.animationDelay = `${Math.random() * 0.3}s`;
            splash.style.animationDuration = `${0.5 + Math.random() * 1}s`;
            
            if (shape === 'organic') {
                splash.style.borderRadius = this.getOrganicShape();
            }
            
            this.container.appendChild(splash);
        }
        
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 1500);
    }

    getOrganicShape() {
        const shapes = [
            '50% 20% 80% 30% / 40% 30% 70% 60%',
            '60% 40% 50% 60% / 60% 50% 50% 40%',
            '30% 70% 70% 30% / 30% 30% 70% 70%',
            '40% 60% 40% 60% / 60% 40% 60% 40%'
        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }
}