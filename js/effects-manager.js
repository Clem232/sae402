export class EffectsManager {
    static applyEffect(element, effect) {
        // Reset classes
        element.className = "image-box";
        
        // Add new effect
        if (effect) {
            element.classList.add(effect);
            
            // Remove effect class after animation completes
            setTimeout(() => {
                element.classList.remove(effect);
            }, 2000);
        }
    }
}