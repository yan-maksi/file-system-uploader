# Image Upload System

![image](https://github.com/user-attachments/assets/2f590614-17c9-4c07-a94d-b58923db23af)

A web application for dynamically creating classes and uploading images, similar to Teachable Machine.

## Features

- Dynamic class creation
- Image upload by file selection
- Camera capture at defined intervals
- Organized image storage by class
- Gallery view for all stored images

## Project Structure

```
project-root/
  ├── server.js         
  ├── package.json      
  ├── imagenes/           # Directory for storing images (created automatically)
  │   └── {class_name}/   
  └── public/             
      ├── index.html     
      └── script.js       
      └── styles.js
      ├── modules/        # Directory for storing structured code for service
         ├── camera.js
         ├── classes.js
         ├── config.js
         ├── ui.js                           
         ├── upload.js                           
         ├── utils.js                           
         └── {class_name}/   

```

## Setup Instructions

1. **Clone or download the project**

2. **Install dependencies**
   ```
   npm install
   ```

3. **Create necessary directories**
   ```
   mkdir -p public imagenes
   ```

4. **Move files to the correct locations**
   - Move `index.html` and `script.js` to the `public` folder
   - Keep `server.js` and `package.json` in the root directory

5. **Start the server**
   ```
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. **Create Classes**
   - Enter a class name and click "Create Class"
   - The created classes will appear in the class list

2. **Upload Images**
   - Select a class from the dropdown
   - Choose files to upload or use the camera capture feature

3. **Camera Capture**
   - Select a class
   - Configure capture settings (number of images and interval)
   - Click "Start Camera" to initialize your webcam
   - Click "Start Capture Sequence" to begin automatic capture
   - Images will be captured at the specified interval

4. **View Images**
   - All uploaded images are displayed in their respective class sections
   - Click "Open Image Gallery" to view a server-rendered page of all images

## Technical Details

- The server uses Express.js for handling HTTP requests
- Multer middleware is used for file uploads
- Images are saved with a timestamp, class name, and counter in the filename
- The camera functionality uses the MediaDevices Web API
- The application doesn't use any frontend frameworks, as required
