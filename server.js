const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors()); // Tesla'nın videoyu kopyalamasına izin verir

app.get('/get-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("URL eksik.");

    try {
        const info = await ytdl.getInfo(videoUrl);
        // Hem ses hem görüntü içeren en iyi formatı seçer
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
        res.json({ streamUrl: format.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Link çözülemedi." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
