export function initCursor() {
    const cursor = document.querySelector(".cursor");
    
    if (!cursor) return; // Sécurité si l'élément n'existe pas
    
    // Variables pour les effets
    let angle = 0;
    let isHovering = false;
    const colors = ['#ff3366', '#66ff33', '#3366ff'];
    let currentColorIndex = 0;
    
    // Style de base
    cursor.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        background-color: ${colors[0]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: 
            transform 0.15s ease,
            width 0.3s ease,
            height 0.3s ease,
            background-color 0.5s ease;
    `;
    
    // Mouvement principal
    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Position de base avec léger retard pour effet fluide
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        
        // Petit effet de vibration
        if (!isHovering) {
            const vibrateX = Math.sin(angle) * 2;
            const vibrateY = Math.cos(angle * 0.5) * 2;
            cursor.style.transform = `translate(-50%, -50%) translate(${vibrateX}px, ${vibrateY}px)`;
        }
        
        angle += 0.1;
    });
    
    // Changement de couleur progressif
    setInterval(() => {
        if (!isHovering) {
            currentColorIndex = (currentColorIndex + 1) % colors.length;
            cursor.style.backgroundColor = colors[currentColorIndex];
        }
    }, 2000);
    
    // Effet d'éclair occasionnel
    setInterval(() => {
        if (Math.random() > 0.9) { // 10% de chance
            cursor.style.boxShadow = `0 0 10px 5px ${colors[currentColorIndex]}`;
            setTimeout(() => {
                cursor.style.boxShadow = 'none';
            }, 300);
        }
    }, 1000);
    
    // Interaction avec les éléments cliquables
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.backgroundColor = 'white';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });
        
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.transform = 'translate(-50%, -50%)';
        });
    });
}