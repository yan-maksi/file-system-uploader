import { setupUI } from './modules/ui.js';
import { uploadImages } from './modules/upload.js';
import { fetchClasses, createClass } from './modules/classes.js';
import { startCamera, stopCamera, startCaptureSequence } from './modules/camera.js';

document.addEventListener('DOMContentLoaded', function() {
    const el = setupUI();
    
    window.appState = {
        classes: [],
        stream: null,
        captureInterval: null,
        captureCounter: 0,
        totalCaptures: 0,
        currentClass: null,
        el: el
    };
    
    fetchClasses();

    el.createClassBtn.addEventListener('click', createClass);
    el.uploadBtn.addEventListener('click', uploadImages);
    el.startCameraBtn.addEventListener('click', startCamera);
    el.stopCameraBtn.addEventListener('click', stopCamera);
    el.captureBtn.addEventListener('click', startCaptureSequence);

    if (API_URL) {
        const galleryLink = document.querySelector('a[href="/ver-imagenes"]');
        if (galleryLink) galleryLink.href = `${API_URL}/ver-imagenes`;
    }
});