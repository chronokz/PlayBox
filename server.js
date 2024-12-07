const express = require('express');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4444;
const configPath = path.join(__dirname, 'config.json');
let videoDirectory = path.join(__dirname, 'videos');
// const videoDirectory = 'C:/Users/chrono/Videos/Honkai  Star Rail/'; //path.join(__dirname, 'videos'); // Папка с видео

app.use(bodyParser.json());
app.use(express.static('public'));

const loadConfig = () => {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config.videoDirectory || videoDirectory;
  }
  return videoDirectory;
}
videoDirectory = loadConfig();

const saveConfig = (directory) => {
  const config = { videoDirectory: directory };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// Функция для получения списка видеофайлов
const getVideoFiles = () => {
  const validExtensions = ['.mp4', '.avi', '.mkv'];
  return fs.readdirSync(videoDirectory)
    .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
    .map(file => file);
};

// Главная страница с плеером
app.get("/", (req, res) => {
  // const videoFiles = getVideoFiles();
  const selectedSource = videoDirectory;
  const source = fs.readFileSync(path.join(__dirname, 'public', 'template.html'), 'utf8');
  const template = Handlebars.compile(source);
  const data = { selectedSource };
  const result = template(data);
  
  res.send(result);
});

// Роут для просмотра видео
app.get("/video/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(videoDirectory, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Видео не найдено');
  }
});

// API
app.post('/change-source', (req, res) => {
  const newDirectory = req.body.directory;
  const absolutePath = path.resolve(newDirectory);
  
  if (!fs.existsSync(absolutePath)) {
    res.status(400).send({ success: false, message: 'Selected folder does not exists.' });
  }
  if (!newDirectory) {
    res.status(400).send({ success: false, message: 'The folder was not selected.' });
  }
  videoDirectory = newDirectory;
  saveConfig(videoDirectory);
  playlist = getVideoFiles();
  res.status(200).send({ success: true, directory: videoDirectory, playlist: playlist });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
