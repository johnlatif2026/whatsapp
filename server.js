const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تخدم الملفات الثابتة
app.use(express.static(__dirname));

app.post('/api/send-bulk', (req, res) => {
    try {
        const { name, phones, gender } = req.body || {};

        if (!name || !phones || !gender) {
            return res.status(400).json({ error: "missing data" });
        }

        const message = gender === "male"
            ? `كل سنة وانت طيب يا ${name} عيد قيامة سعيد عليك وعلى الاسرة يقلبي`
            : `كل سنة وانتِ طيبة يا ${name}`;

        const encoded = encodeURIComponent(message);

        const urls = phones.map(phone =>
            `https://wa.me/${phone}?text=${encoded}`
        );

        return res.status(200).json({ urls });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
