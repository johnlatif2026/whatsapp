const express = require('express');

const app = express();

app.use(express.json());

// API إرسال جماعي
app.post('/api/send-bulk', (req, res) => {
    const { name, phones, gender } = req.body;

    if (!name || !phones || !gender) {
        return res.status(400).json({ error: "بيانات ناقصة" });
    }

    let message = gender === "male"
        ? `كل سنة وانت طيب يا ${name}`
        : `كل سنة وانتِ طيبة يا ${name}`;

    const encodedMessage = encodeURIComponent(message);

    const urls = phones.map(phone => {
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    });

    res.json({ urls });
});

// مهم جدًا لـ Vercel
module.exports = app;
