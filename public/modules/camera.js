import { showNotification } from './utils.js';
import { uploadImage } from './upload.js';

export async function startCamera() {
    const { el } = window.appState;
    const className = el.classSelect.value;
    
    if (!className) {
        showNotification('Please select a class', 'error');
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (!el.video || !el.videoContainer) {
            throw new Error('Video elements not found in the DOM');
        }
        
        el.video.srcObject = stream;
        el.videoContainer.style.display = 'block';
        
        if (el.startCameraBtn) el.startCameraBtn.disabled = true;
        if (el.stopCameraBtn) el.stopCameraBtn.disabled = false;
        if (el.captureBtn) el.captureBtn.disabled = false;
        
        window.appState.stream = stream;
        window.appState.currentClass = className;
    } catch (error) {
        console.error('Camera error:', error);
        showNotification('Error accessing camera', 'error');
    }
}

export function stopCamera() {
    const { el, stream, captureInterval } = window.appState;
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        window.appState.stream = null;
    }
    
    if (el.videoContainer) el.videoContainer.style.display = 'none';
    if (el.startCameraBtn) el.startCameraBtn.disabled = false;
    if (el.stopCameraBtn) el.stopCameraBtn.disabled = true;
    if (el.captureBtn) el.captureBtn.disabled = true;
    
    if (captureInterval) {
        clearInterval(captureInterval);
        window.appState.captureInterval = null;
    }
    
    if (el.captureCountDisplay) {
        el.captureCountDisplay.style.display = 'none';
    }
}

export function startCaptureSequence() {
    const { el } = window.appState;
    
    const numCaptures = el.captureCountInput && el.captureCountInput.value ? 
                         parseInt(el.captureCountInput.value) : 5;
    
    const intervalSeconds = el.captureIntervalInput && el.captureIntervalInput.value ? 
                             parseInt(el.captureIntervalInput.value) : 2;
    
    if (numCaptures <= 0 || intervalSeconds <= 0) {
        showNotification('Invalid capture settings', 'error');
        return;
    }
    
    window.appState.captureCounter = 0;
    window.appState.totalCaptures = numCaptures;
    
    if (el.captureCountDisplay) {
        el.captureCountDisplay.textContent = `Capturing: ${window.appState.captureCounter}/${window.appState.totalCaptures}`;
        el.captureCountDisplay.style.display = 'block';
    }
    
    if (el.captureBtn) {
        el.captureBtn.disabled = true;
    }
    
    captureImage();
    
    window.appState.captureInterval = setInterval(() => {
        if (window.appState.captureCounter >= window.appState.totalCaptures) {
            clearInterval(window.appState.captureInterval);
            window.appState.captureInterval = null;
            
            // Add null checks
            if (el.captureCountDisplay) {
                el.captureCountDisplay.style.display = 'none';
            }
            
            if (el.captureBtn) {
                el.captureBtn.disabled = false;
            }
            
            showNotification(`Captured ${window.appState.totalCaptures} images`);
            return;
        }
        
        captureImage();
    }, intervalSeconds * 1000);
}

function captureImage() {
    const { el, stream, currentClass } = window.appState;
    
    if (!stream || !currentClass) return;
    
    if (!el.canvas || !el.video) {
        console.error('Canvas or video element not found');
        return;
    }
    
    el.canvas.width = el.video.videoWidth;
    el.canvas.height = el.video.videoHeight;
    
    const ctx = el.canvas.getContext('2d');
    ctx.drawImage(el.video, 0, 0, el.canvas.width, el.canvas.height);

    el.canvas.toBlob(async (blob) => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        window.appState.captureCounter++;
        
        if (el.captureCountDisplay) {
            el.captureCountDisplay.textContent = `Capturing: ${window.appState.captureCounter}/${window.appState.totalCaptures}`;
        }
        
        await uploadImage(file, currentClass, window.appState.captureCounter);
    }, 'image/jpeg', 0.9);
}