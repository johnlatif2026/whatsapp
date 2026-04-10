const express = require('express');
const app = express();

app.use(express.json());

// API
app.post('/api/send', (req, res) => {
    const { name, phone, gender } = req.body;

    if (!name || !phone || !gender) {
        return res.status(400).json({ error: "بيانات ناقصة" });
    }

    let message = "";

    if (gender === "male") {
        message = `كل سنة وانت طيب يا ${name}`;
    } else {
        message = `كل سنة وانتي طيبة يا ${name}`;
    }

    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    res.json({ url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
