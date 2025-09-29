require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ ok: true, message: 'Shop backend running' }));

app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on  http://localhost:${PORT}`));