const express = require('express');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API إرسال جماعي
app.post('/api/send-bulk', (req, res) => {
    try {
        const { name, phones, gender } = req.body || {};

        if (!name || !phones || !gender) {
            return res.status(400).json({ error: "missing data" });
        }

        const message = gender === "male"
            ? `كل سنة وانت طيب يا ${name}`
            : `كل سنة وانتِ طيبة يا ${name}`;

        const encoded = encodeURIComponent(message);

        const urls = phones.map(p => {
            return `https://wa.me/${p}?text=${encoded}`;
        });

        return res.status(200).json({ urls });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = app;
