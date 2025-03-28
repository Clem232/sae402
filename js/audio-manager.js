export class AudioManager {
    constructor(audioFiles, typingSoundFile) {
        this.audioElements = audioFiles.map(file => new Audio(file));
        this.typingSound = new Audio(typingSoundFile);
        this.soundOn = true;
        this.audioContext = null;
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioElements.forEach(audio => {
                const source = this.audioContext.createMediaElementSource(audio);
                source.connect(this.audioContext.destination);
            });
            
            const typingSource = this.audioContext.createMediaElementSource(this.typingSound);
            typingSource.connect(this.audioContext.destination);
        }
    }

    playAudio(index) {
        if (!this.soundOn || index === undefined || index >= this.audioElements.length) return;

        const currentAudio = this.audioElements.find(audio => !audio.paused);
        const newAudio = this.audioElements[index];

        // Si c'est déjà la même piste qui joue, ne rien faire
        if (currentAudio === newAudio) return;

        // Arrêter toutes les pistes audio
        this.stopAllAudio();

        // Jouer la nouvelle piste
        try {
            newAudio.currentTime = 0; // Réinitialiser au début
            newAudio.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.error("Error playing audio:", e);
        }
    }

    stopAllAudio() {
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.stopTypingSound();
    }

    toggleSound() {
        this.soundOn = !this.soundOn;

        if (this.soundOn) {
            return "images/sonon.png";
        } else {
            this.audioElements.forEach(audio => audio.pause());
            this.typingSound.pause();
            return "images/sonoff.png";
        }
    }

    startTypingSound() {
        if (this.soundOn && this.typingSound) {
            this.typingSound.currentTime = 0;
            this.typingSound.loop = true;
            this.typingSound.play().catch(e => console.log("Typing sound play failed:", e));
        }
    }

    stopTypingSound() {
        if (this.typingSound) this.typingSound.pause();
    }
}
