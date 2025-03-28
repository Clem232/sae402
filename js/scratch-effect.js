export class ScratchEffect {
    constructor() {
        this.isActive = false;
    }

    createScratchOverlay(currentSlide) {
        if (this.isActive) return;
        this.isActive = true;

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

        const scratchContainer = document.createElement('div');
        scratchContainer.className = 'scratch-container';
        scratchContainer.style.position = 'relative';
        scratchContainer.style.width = '90%';
        scratchContainer.style.height = '90%';

        const colorImage = document.createElement('img');
        colorImage.src = currentSlide.image.replace('images/', 'images/colo/');
        colorImage.style.width = '100%';
        colorImage.style.height = '100%';
        colorImage.style.objectFit = 'cover';

        const scratchCanvas = document.createElement('canvas');
        scratchCanvas.id = 'scratchCanvas';
        scratchCanvas.style.position = 'absolute';
        scratchCanvas.style.top = '0';
        scratchCanvas.style.left = '0';
        scratchCanvas.style.cursor = 'crosshair';

        scratchContainer.appendChild(colorImage);
        scratchContainer.appendChild(scratchCanvas);
        scratchOverlay.appendChild(scratchContainer);

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

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(scratchOverlay);
            this.isActive = false;
        });

        scratchOverlay.appendChild(closeBtn);
        document.body.appendChild(scratchOverlay);

        this.initCanvas(scratchCanvas, currentSlide.image);
    }

    initCanvas(canvas, imageSrc) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const scratchLayer = new Image();
        scratchLayer.src = imageSrc;

        scratchLayer.onload = function() {
            ctx.drawImage(scratchLayer, 0, 0, canvas.width, canvas.height);
        };

        let isDrawing = false;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
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

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mousemove', (e) => {
            scratch(e);
            e.preventDefault();
        });

        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            scratch(e.touches[0]);
        });

        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            scratch(e.touches[0]);
        });
    }
}