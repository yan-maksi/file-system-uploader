export function setupUI() {

    const elements = {
        createClassBtn: document.getElementById('createClassBtn'),
        classNameInput: document.getElementById('className'),
        
        classList: document.getElementById('classList'),
        classSelect: document.getElementById('classSelect'),
        imageUpload: document.getElementById('imageUpload'),
        uploadBtn: document.getElementById('uploadBtn'),

        startCameraBtn: document.getElementById('startCameraBtn'),
        stopCameraBtn: document.getElementById('stopCameraBtn'),
        captureBtn: document.getElementById('captureBtn'),

        videoContainer: document.getElementById('videoContainer'),
        video: document.getElementById('video'),
        canvas: document.getElementById('canvas'),

        captureCountDisplay: document.getElementById('captureCountDisplay'),
        captureCountInput: document.getElementById('captureCountInput'),

        captureIntervalInput: document.getElementById('captureIntervalInput'),
        classesContainer: document.getElementById('classesContainer'),
        notification: document.getElementById('notification')
    };
    
    if (elements.captureCountInput) {
        elements.captureCountInput.value = elements.captureCountInput.value || '5';
    }
    
    if (elements.captureIntervalInput) {
        elements.captureIntervalInput.value = elements.captureIntervalInput.value || '2';
    }
    
    return elements;
}