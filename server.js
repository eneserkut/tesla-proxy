const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core'); // En güncel sürümü kullandığınızdan emin olun
const app = express();

app.use(cors());

// Yeni aldığınız Cookie'yi buraya yapıştırın
const YT_COOKIE = "BURAYA_YENI_COOKIE_GELECEK";

app.get('/get-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("URL eksik.");

    try {
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'cookie': YT_COOKIE,
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });

        // Tesla için en uygun formatı seç (Hem ses hem görüntü)
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
        console.error("Detaylı Hata:", err.message);
        // Hata mesajını frontend'e gönder
        res.status(500).json({ error: "YouTube engeline takıldı. Cookie tazeleyin." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend aktif.`));
