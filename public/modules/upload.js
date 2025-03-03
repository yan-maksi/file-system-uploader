import { API_URL } from './config.js';
import { showNotification } from './utils.js';
import { addImageToUI } from './images.js';

export async function uploadImages() {
    const { el } = window.appState;
    const className = el.classSelect.value;
    const files = el.imageUpload.files;
    
    if (!className) {
        showNotification('Please select a class', 'error');
        return;
    }
    
    if (!files || files.length === 0) {
        showNotification('Please select at least one image', 'error');
        return;
    }
    
    for (let i = 0; i < files.length; i++) {
        await uploadImage(files[i], className, i);
    }
    
    el.imageUpload.value = '';
    showNotification(`${files.length} images uploaded`);
}

export async function uploadImage(file, className, counter = 0) {
    const formData = new FormData();
    
    formData.append('className', className);
    formData.append('counter', counter);
    formData.append('image', file);
    
    try {
        console.log(`Uploading to class: ${className}, counter: ${counter}`);
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Upload failed');
        }
        
        const data = await response.json();
        
        const imageUrl = `${API_URL}/${data.file.destination.substring(2)}/${data.file.filename}`;
        addImageToUI(className, imageUrl, data.file.filename);
        return true;
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification(`Upload error: ${error.message}`, 'error');
        return false;
    }
}