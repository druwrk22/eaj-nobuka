const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'data', 'todos.json');
const CATEGORY_PATH = path.join(__dirname, 'data', 'categories.json');

const getCategories = () => {
    if (!fs.existsSync(CATEGORY_PATH)) fs.writeFileSync(CATEGORY_PATH, JSON.stringify(["Umum", "Kerja", "Pribadi"]));
    return JSON.parse(fs.readFileSync(CATEGORY_PATH));
};

const saveCategories = (cats) => {
    fs.writeFileSync(CATEGORY_PATH, JSON.stringify(cats, null, 2));
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const getTodos = () => {
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
};

const saveTodos = (todos) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
};

app.get('/', (req, res) => {
    const todos = getTodos();
    const categories = getCategories();
    const filter = req.query.cat; 

    const filteredTodos = filter && filter !== 'Semua' 
        ? todos.filter(t => t.category === filter) 
        : todos;

    res.render('index', { 
        todos: filteredTodos, 
        categories, 
        activeCat: filter || 'Semua' 
    });
});

app.post('/categories', (req, res) => {
    const categories = getCategories();
    const newCat = req.body.newCategory.trim();
    if (newCat && !categories.includes(newCat)) {
        categories.push(newCat);
        saveCategories(categories);
    }
    res.redirect('/');
});

app.post('/categories/delete', (req, res) => {
    const { categoryName } = req.body;
    let categories = getCategories();
    
    if (categoryName === "Umum") {
        return res.redirect('/?error=default_cat');
    }

    categories = categories.filter(c => c !== categoryName);
    saveCategories(categories);

    let todos = getTodos();
    todos = todos.map(todo => {
        if (todo.category === categoryName) {
            todo.category = 'Umum';
        }
        return todo;
    });
    saveTodos(todos);

    res.redirect('/');
});

app.post('/add', (req, res) => {
    const todos = getTodos();
    const newTodo = {
        id: Date.now().toString(),
        task: req.body.task,
        category: req.body.category,
        dueDate: req.body.dueDate,
        completed: false
    };
    todos.push(newTodo);
    saveTodos(todos);
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    let todos = getTodos();
    todos = todos.filter(t => t.id !== req.params.id);
    saveTodos(todos);
    res.redirect('/');
});

app.post('/toggle/:id', (req, res) => {
    const todos = getTodos();
    const todo = todos.find(t => t.id === req.params.id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
    }
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server lari di http://localhost:${PORT}`);
});