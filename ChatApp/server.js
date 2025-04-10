const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3300;

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));



app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const imageUrl = `/uploads/${req.file.filename}`;
    io.emit('chat image', imageUrl); // ✅ Send only the path string
    res.status(200).send('Image uploaded and broadcasted.');
  } else {
    res.status(400).send('No file uploaded.');
  }
});


io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('chat message',(msg)=>{
    io.emit('chat message',msg);
  })
});

http.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});   