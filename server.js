const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API إرسال جماعي
app.post('/api/send-bulk', (req, res) => {
    const { name, phones, gender } = req.body;

    if (!name || !phones || !gender) {
        return res.status(400).json({ error: "missing data" });
    }

    const message = gender === "male"
        ? `كل سنة وانت طيب يا ${name}`
        : `كل سنة وانتِ طيبة يا ${name}`;

    const encoded = encodeURIComponent(message);

    const urls = phones.map(p => `https://wa.me/${p}?text=${encoded}`);

    res.json({ urls });
});

module.exports = app;
