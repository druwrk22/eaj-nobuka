const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const webRoutes = require('./routes/web');

const app = express();
const PORT = 3000;

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', webRoutes);

app.listen(PORT, () => {
    console.log(`Server lari di http://localhost:${PORT}`);
});