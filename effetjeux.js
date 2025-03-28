document.addEventListener('DOMContentLoaded', function () {

    // Add this line RIGHT AT THE START to handle line breaks in text content
      // Add this line back (make sure it's before any other code)
      document.getElementById('text').style.whiteSpace = 'pre-line';

    const paintBtn = document.getElementById('paintBtn');

    paintBtn.addEventListener('click', function () {
        const currentSlide = slides[currentSlideIndex];
        const currentIcon = document.getElementById('paintIcon').src;
        
        // Ne pas déclencher si c'est le bucket
        if (currentIcon.includes('bucket.png')) {
            // Pour les slides avec bucket, juste changer l'image directement
            document.getElementById('slideImage').src = currentSlide.image.replace('images/', 'images/colo/');
            return;
        }
        
        // Créer l'overlay de grattage
        const scratchOverlay = document.createElement('div');
        scratchOverlay.className = 'scratch-overlay';
        scratchOverlay.style.position = 'fixed';
        scratchOverlay.style.top = '0';
        scratchOverlay.style.left = '0';
        scratchOverlay.style.width = '100%';
        scratchOverlay.style.height = '100%';
        scratchOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        scratchOverlay.style.zIndex = '2000';
        scratchOverlay.style.display = 'flex';
        scratchOverlay.style.justifyContent = 'center';
        scratchOverlay.style.alignItems = 'center';

        // Créer le conteneur du canvas
        const scratchContainer = document.createElement('div');
        scratchContainer.className = 'scratch-container';
        scratchContainer.style.position = 'relative';
        scratchContainer.style.width = '90%';
        scratchContainer.style.height = '90%';

        // Créer l'image de fond (version couleur)
        const colorImage = document.createElement('img');
        colorImage.src = currentSlide.image.replace('images/', 'images/colo/');
        colorImage.style.width = '100%';
        colorImage.style.height = '100%';
        colorImage.style.objectFit = 'cover';

        // Créer le canvas pour gratter
        const scratchCanvas = document.createElement('canvas');
        scratchCanvas.id = 'scratchCanvas';
        scratchCanvas.style.position = 'absolute';
        scratchCanvas.style.top = '0';
        scratchCanvas.style.left = '0';
        scratchCanvas.style.cursor = 'crosshair';

        // Ajout des éléments
        scratchContainer.appendChild(colorImage);
        scratchContainer.appendChild(scratchCanvas);
        scratchOverlay.appendChild(scratchContainer);

        // Bouton de fermeture
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '2rem';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';

        closeBtn.addEventListener('click', function () {
            document.body.removeChild(scratchOverlay);
        });

        scratchOverlay.appendChild(closeBtn);
        document.body.appendChild(scratchOverlay);

        // Initialiser le canvas
        const ctx = scratchCanvas.getContext('2d');
        scratchCanvas.width = scratchContainer.offsetWidth;
        scratchCanvas.height = scratchContainer.offsetHeight;

        // Dessiner la couche à gratter (noir et blanc)
        const scratchLayer = new Image();
        scratchLayer.src = currentSlide.image;

        scratchLayer.onload = function () {
            ctx.drawImage(scratchLayer, 0, 0, scratchCanvas.width, scratchCanvas.height);
        };

        let isDrawing = false;

        function getMousePos(e) {
            const rect = scratchCanvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        function scratch(e) {
            if (!isDrawing) return;
            const pos = getMousePos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 50, 0, Math.PI * 2);
            ctx.fill();
        }

        // Événements souris
        scratchCanvas.addEventListener('mousedown', () => isDrawing = true);
        scratchCanvas.addEventListener('mouseup', () => isDrawing = false);
        scratchCanvas.addEventListener('mousemove', (e) => {
            scratch(e);
            e.preventDefault();
        });

        // Événements tactiles
        scratchCanvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            scratch(e.touches[0]);
        });

        scratchCanvas.addEventListener('touchend', () => isDrawing = false);
        scratchCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            scratch(e.touches[0]);
        });
    });
});