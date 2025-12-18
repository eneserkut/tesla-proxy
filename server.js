const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

app.get('/get-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("URL eksik.");

    try {
        // YouTube kısıtlamalarını aşmak için ajan (agent) ayarları
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
                }
            }
        });

        // Hem ses hem görüntü içeren, oynatılabilir bir format seç
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
        console.error("YTDL Hatası:", err.message);
        res.status(500).json({ error: "YouTube bu isteği engelledi veya link hatalı." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} üzerinde çalışıyor.`));
