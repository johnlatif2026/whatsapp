const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'data.json');

// تحميل البيانات
function loadData() {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

// حفظ البيانات
function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// إضافة شخص
app.post('/api/add-person', (req, res) => {
    const { name, phone, gender } = req.body;

    if (!name || !phone || !gender) {
        return res.status(400).json({ error: "missing data" });
    }

    const data = loadData();

    data.push({ name, phone, gender });

    saveData(data);

    res.json({ success: true, data });
});

// جلب السجل
app.get('/api/people', (req, res) => {
    res.json(loadData());
});

// إرسال لكل الموجودين
app.post('/api/send-all', (req, res) => {
    const data = loadData();

    const urls = data.map(person => {
        const message = person.gender === "male"
            ? `كل سنة وانت طيب يا ${person.name} عيد قيامة سعيد عليك وعلى الاسرة يقلب اخوك`
            : `كل سنة وانتِ طيبة يا ${person.name}`;

        return `https://wa.me/${person.phone}?text=${encodeURIComponent(message)}`;
    });

    res.json({ urls });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
