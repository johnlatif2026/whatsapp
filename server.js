const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/send', async (req, res) => {
  const { name, phone, gender } = req.body;

  let message = '';
  if (gender === 'male') {
    message = `خريستوس انيستي ✝️
كل سنة وانت طيب يا ${name} عيد قيامة سعيد عليك وعلى الاسرة`;
  } else {
    message = `خريستوس انيستي ✝️
كل سنة وانتِ طيبة يا ${name}`;
  }

  try {
    await fetch(`https://graph.facebook.com/v18.0/${process.env.PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message }
      })
    });

    res.json({status:'sent'});
  } catch (err) {
    res.json({error: err.message});
  }
});

module.exports = app;
