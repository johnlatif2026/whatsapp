const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

/* ================= FIREBASE INIT ================= */

// قراءة Firebase config من .env
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// إصلاح مشكلة الـ private_key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// تشغيل Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/* ================= ADD PERSON ================= */

app.post('/api/add', async (req, res) => {
    try {
        const { name, phone, gender } = req.body;

        if (!name || !phone || !gender) {
            return res.status(400).json({ error: "missing data" });
        }

        const doc = await db.collection('people').add({
            name,
            phone,
            gender,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            id: doc.id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= GET PEOPLE ================= */

app.get('/api/people', async (req, res) => {
    try {
        const snapshot = await db.collection('people')
            .orderBy('createdAt', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= SEND ALL (WA LINKS + LOGGING) ================= */

app.post('/api/send-all', async (req, res) => {
    try {
        const snapshot = await db.collection('people').get();

        const urls = [];

        for (let doc of snapshot.docs) {
            const p = doc.data();

            const message = p.gender === "male"
                ? `كل سنة وانت طيب يا ${p.name} 🎉`
                : `كل سنة وانتِ طيبة يا ${p.name} 🎉`;

            const url = `https://wa.me/${p.phone}?text=${encodeURIComponent(message)}`;

            // حفظ اللوج في Firestore
            await db.collection('messages').add({
                personId: doc.id,
                name: p.name,
                phone: p.phone,
                message,
                status: "sent",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            urls.push(url);
        }

        res.json({ urls });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= GET MESSAGES LOG ================= */

app.get('/api/messages', async (req, res) => {
    try {
        const snapshot = await db.collection('messages')
            .orderBy('createdAt', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= FRONTEND ================= */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});
