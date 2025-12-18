const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

// BURAYA kopyaladığınız Cookie metnini tırnak içine yapıştırın
const YT_COOKIE = "BURAYA_KOPYALADIGINIZ_COOKIE_GELECEK";

app.get('/get-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("URL eksik.");

    try {
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'cookie': YT_COOKIE,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });

        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestvideo', 
            filter: 'audioandvideo' 
        });

        if (format && format.url) {
            res.json({ streamUrl: format.url });
        } else {
            res.status(500).json({ error: "Uygun format bulunamadı." });
        }
    } catch (err) {
        console.error("Hata Detayı:", err.message);
        res.status(500).json({ error: "YouTube Erişimi Engelledi! Cookie yenilemeniz gerekebilir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu aktif.`));
