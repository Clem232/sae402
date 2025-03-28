export class SplashEffect {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'color-splashes';
        document.body.appendChild(this.container);
        this.splashSound = new Audio("sons/splash.mp3"); // Ajoutez ce fichier dans votre dossier sons
    }

    createSplashes(count = 15) {
        // Vider le conteneur
        this.container.innerHTML = '';
        this.container.style.display = 'block';
        
        // Jouer le son
        this.splashSound.currentTime = 0;
        this.splashSound.play().catch(e => console.log("Splash sound error:", e));
        
        // Créer les taches
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const sizes = [50, 100, 150, 200];
        
        for (let i = 0; i < count; i++) {
            const splash = document.createElement('div');
            splash.className = 'color-splash';
            
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            splash.style.width = `${size}px`;
            splash.style.height = `${size}px`;
            splash.style.background = color;
            splash.style.left = `${Math.random() * 100}%`;
            splash.style.top = `${Math.random() * 100}%`;
            splash.style.animationDelay = `${Math.random() * 0.5}s`;
            
            this.container.appendChild(splash);
        }
        
        // Cacher après l'animation
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 1000);
    }
}