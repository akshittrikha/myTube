require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const {engine} = require('express-handlebars');

const path = require('path')

const app = express()

app.engine('handlebars', engine({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
 }));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    console.log('GET /')
    res.render('index')
})

app.get("/embed", (req, res) => {
    console.log(req.query)
    const youtube_url = req.query.youtube_url
    const parsedUrl = new URL(youtube_url, 'https://www.youtube.com');

    // Validate the host to ensure it's a valid YouTube URL
    if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com' || parsedUrl.hostname === 'm.youtube.com') {
        // Get the 'v' parameter, which is the video ID
        const videoId = parsedUrl.searchParams.get('v');
    
        // Ensure videoId exists and is in a valid format
        if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            res.render('embed', { embedUrl: embedUrl });
        } else {
            res.status(400).send('Invalid video ID');
        }
    } else {
        res.status(400).send('Invalid YouTube URL');
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port http://localhost:${process.env.PORT}`)
})