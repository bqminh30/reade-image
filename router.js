//router.js
const express = require('express');
const app = express();
const path = require('path');

const router = express.Router();
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');
const postImage = require('./getImage');

// const imagePath = './img.jpg';
const endpointUrl = 'https://lens.google.com/v3/upload';

// postImage(imagePath, endpointUrl);

router.get('/', async function (req, res) {
    await res.render('index');
});

router.post('/post', upload.single('image'), async function (req, res) {
    res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    // folder upload
    const imagePath = path.join(__dirname, '/public/images');
    // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    const data = await postImage(`${imagePath}/${filename}`,endpointUrl)
    return res.status(200).json({ name: data });
});

module.exports = router;
