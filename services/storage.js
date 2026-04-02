const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/todos.json');
const CATEGORY_PATH = path.join(__dirname, '../data/categories.json');

if (!fs.existsSync(path.join(__dirname, '../data'))) fs.mkdirSync(path.join(__dirname, '../data'));
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([]));
if (!fs.existsSync(CATEGORY_PATH)) fs.writeFileSync(CATEGORY_PATH, JSON.stringify(["Umum", "Kerja", "Pribadi"]));

const storage = {
    getTodos: () => JSON.parse(fs.readFileSync(DATA_PATH)),
    saveTodos: (todos) => fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2)),
    
    getCategories: () => JSON.parse(fs.readFileSync(CATEGORY_PATH)),
    saveCategories: (cats) => fs.writeFileSync(CATEGORY_PATH, JSON.stringify(cats, null, 2))
};

module.exports = storage;