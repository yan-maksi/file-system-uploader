import { API_URL } from './config.js';
import { showNotification } from './utils.js';
import { loadAllClassImages } from './images.js';

export async function fetchClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const data = await response.json();
        window.appState.classes = data.classes || [];
        updateClassList();
        updateClassSelect();
        await loadAllClassImages();
    } catch (error) {
        console.error('Error fetching classes:', error);
        showNotification('Error loading classes', 'error');
    }
}

export function updateClassList() {
    const { el, classes } = window.appState;
    el.classList.innerHTML = '';
    
    classes.forEach(className => {
        const classItem = document.createElement('div');
        classItem.className = 'class-item';
        
        const classNameSpan = document.createElement('span');
        classNameSpan.className = 'class-name';
        classNameSpan.textContent = className;
        
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'class-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete class "${className}"?`)) {
                window.appState.classes = classes.filter(c => c !== className);
                updateClassList();
                updateClassSelect();
                
                const classSection = document.getElementById(`class-${className}`);
                if (classSection) classSection.remove();
            }
        });
        
        classItem.appendChild(classNameSpan);
        classItem.appendChild(deleteBtn);
        el.classList.appendChild(classItem);
    });
}

export function updateClassSelect() {
    const { el, classes } = window.appState;
    const currentSelection = el.classSelect.value;
    
    while (el.classSelect.options.length > 1) {
        el.classSelect.remove(1);
    }
    
    classes.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        el.classSelect.appendChild(option);
    });
    
    if (currentSelection && classes.includes(currentSelection)) {
        el.classSelect.value = currentSelection;
    }
}

export function createClass() {
    const { el, classes } = window.appState;
    const className = el.classNameInput.value.trim();
    
    if (!className) {
        showNotification('Please enter a class name', 'error');
        return;
    }
    
    if (classes.includes(className)) {
        showNotification('Class already exists', 'error');
        return;
    }
    
    window.appState.classes.push(className);
    updateClassList();
    updateClassSelect();
    el.classSelect.value = className;
    createClassSection(className);
    el.classNameInput.value = '';
    
    showNotification(`Class "${className}" created`);
}

export function createClassSection(className) {
    if (document.getElementById(`class-${className}`)) return;
    
    const { el } = window.appState;
    const classSection = document.createElement('div');
    classSection.className = 'class-section';
    classSection.id = `class-${className}`;
    
    const classHeader = document.createElement('div');
    classHeader.className = 'class-header';
    classHeader.textContent = `Class: ${className}`;
    
    const classImages = document.createElement('div');
    classImages.className = 'class-images';
    classImages.id = `images-${className}`;
    
    classSection.appendChild(classHeader);
    classSection.appendChild(classImages);
    el.classesContainer.appendChild(classSection);
}