import { API_URL } from './config.js';
import { createClassSection } from './classes.js';

// Loads images for all classes
export async function loadAllClassImages() {
    const { classes } = window.appState;
    for (const className of classes) {
        await loadClassImages(className);
    }
}

// Loads images for specific class
export async function loadClassImages(className) {
    try {
        createClassSection(className);
        
        const response = await fetch(`${API_URL}/images/${className}`);
        const data = await response.json();
        
        const imagesContainer = document.getElementById(`images-${className}`);
        imagesContainer.innerHTML = '';
        
        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                addImageToUI(className, `${API_URL}${image.url}`, image.name);
            });
        } else {
            imagesContainer.innerHTML = '<p>No images in this class</p>';
        }
    } catch (error) {
        console.error(`Error loading images for ${className}:`, error);
    }
}

// Adds image to UI
export function addImageToUI(className, imageUrl, imageName) {
    createClassSection(className);
    
    const imagesContainer = document.getElementById(`images-${className}`);
    const noImagesMsg = imagesContainer.querySelector('p');
    if (noImagesMsg) imagesContainer.innerHTML = '';
    
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageName || 'Image';
    
    const removeBtn = document.createElement('div');
    removeBtn.className = 'image-remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
        if (confirm('Remove this image?')) {
            imageItem.remove();
            if (imagesContainer.children.length === 0) {
                imagesContainer.innerHTML = '<p>No images in this class</p>';
            }
        }
    });
    
    imageItem.appendChild(img);
    imageItem.appendChild(removeBtn);
    imagesContainer.appendChild(imageItem);
}