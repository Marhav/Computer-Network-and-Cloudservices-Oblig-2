const express = require('express');
const app = express();
app.listen(2828, () => console.log('Listening for connections....'));
app.use(express.static('public'))