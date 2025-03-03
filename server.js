const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination - req.body:', req.body);
    const className = req.body.className || 'default';
    const dir = `./imagenes/${className}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    console.log('Multer filename - req.body:', req.body);
    const className = req.body.className || 'default';
    const counter = req.body.counter || '0';
    const filename = `${Date.now()}_${className}_${counter}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) 
      ? cb(new Error('Only image files allowed'), false) 
      : cb(null, true);
  }
});

app.post('/upload', (req, res) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Error uploading image', error: err.message });
    }
    
    console.log('Upload success - req.body:', req.body);
    console.log('Upload success - req.file:', req.file);
    
    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      file: req.file 
    });
  });
});

app.get('/classes', (req, res) => {
  const imageDirPath = './imagenes';
  if (!fs.existsSync(imageDirPath)) fs.mkdirSync(imageDirPath, { recursive: true });
  
  fs.readdir(imageDirPath, (err, folders) => {
    if (err) return res.status(500).json({ message: 'Error reading directories', error: err.message });
    
    const classes = folders.filter(folder => fs.statSync(path.join(imageDirPath, folder)).isDirectory());
    res.status(200).json({ classes });
  });
});

app.get('/images/:className', (req, res) => {
  const dirPath = `./imagenes/${req.params.className}`;
  
  if (!fs.existsSync(dirPath)) return res.status(404).json({ message: 'Class not found' });
  
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error reading files', error: err.message });
    
    const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()));
    const images = imageFiles.map(file => ({ name: file, url: `/imagenes/${req.params.className}/${file}` }));
    
    res.status(200).json({ images });
  });
});

app.get('/ver-imagenes', async (req, res) => {
  const imageDirPath = './imagenes';
  if (!fs.existsSync(imageDirPath)) {
    fs.mkdirSync(imageDirPath, { recursive: true });
    return res.send('<h1>No images available yet</h1>');
  }
  
  fs.readdir(imageDirPath, async (err, folders) => {
    if (err) return res.status(500).send('Error reading directories');
    
    let html = '<html><head><title>Stored Images</title>';
    html += '<style>body{font-family:Arial;margin:20px}.class-section{margin-bottom:30px}h2{color:#333;border-bottom:1px solid #ccc;padding-bottom:10px}.image-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.image-item{border:1px solid #ddd;padding:10px;border-radius:4px}.image-item img{width:100%;height:auto}.image-name{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}</style>';
    html += '</head><body><h1>Stored Images by Class</h1>';
    
    const classes = folders.filter(folder => fs.statSync(path.join(imageDirPath, folder)).isDirectory());
    
    if (classes.length === 0) {
      html += '<p>No classes created yet.</p>';
    } else {
      for (const className of classes) {
        const dirPath = path.join(imageDirPath, className);
        
        try {
          const dir = await fs.promises.opendir(dirPath);
          const files = [];
          
          for await (const dirent of dir) {
            if (dirent.isFile() && ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(dirent.name).toLowerCase())) {
              files.push(dirent.name);
            }
          }
          
          html += `<div class="class-section"><h2>Class: ${className}</h2>`;
          
          if (files.length === 0) {
            html += `<p>No images in this class.</p>`;
          } else {
            html += `<div class="image-grid">`;
            for (const file of files) {
              html += `<div class="image-item"><img src="/imagenes/${className}/${file}" alt="${file}"><div class="image-name">${file}</div></div>`;
            }
            html += `</div>`;
          }
          
          html += `</div>`;
        } catch (error) {
          html += `<div class="class-section"><h2>Class: ${className}</h2><p>Error reading images: ${error.message}</p></div>`;
        }
      }
    }
    
    html += '</body></html>';
    res.send(html);
  });
});

app.use('/imagenes', express.static('imagenes'));



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  const imageDirPath = './imagenes';
  if (!fs.existsSync(imageDirPath)) fs.mkdirSync(imageDirPath, { recursive: true });
});