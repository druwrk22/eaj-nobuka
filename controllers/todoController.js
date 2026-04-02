const storage = require('../services/storage');

exports.getIndex = (req, res) => {
    const todos = storage.getTodos();
    const categories = storage.getCategories();
    
    const filter = req.query.cat || 'Semua';
    const status = req.query.status || 'active'; 

    let filteredTodos = todos.filter(t => status === 'done' ? t.completed : !t.completed);

    if (filter !== 'Semua') {
        filteredTodos = filteredTodos.filter(t => t.category === filter);
    }

    filteredTodos.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    res.render('index', { 
        todos: filteredTodos, 
        categories, 
        activeCat: filter, 
        currentStatus: status 
    });
};

exports.addTodo = (req, res) => {
    const todos = storage.getTodos();
    todos.push({
        id: Date.now().toString(),
        task: req.body.task,
        category: req.body.category || 'Umum',
        dueDate: req.body.dueDate,
        completed: false
    });
    storage.saveTodos(todos);
    res.redirect('/');
};

exports.deleteTodo = (req, res) => {
    let todos = storage.getTodos();
    todos = todos.filter(t => t.id !== req.params.id);
    storage.saveTodos(todos);
    res.redirect('/?msg=delete_success');
};

exports.toggleTodo = (req, res) => {
    const todos = storage.getTodos();
    const todo = todos.find(t => t.id === req.params.id);
    if (todo) {
        todo.completed = !todo.completed;
        storage.saveTodos(todos);
    }
    
    if(todo.completed){
        res.redirect('/?msg=done_success');
    }else{
        res.redirect('/');
    }
};

exports.addCategory = (req, res) => {
    const categories = storage.getCategories();
    const newCat = req.body.newCategory.trim();
    if (newCat && !categories.includes(newCat)) {
        categories.push(newCat);
        storage.saveCategories(categories);
    }
    res.redirect('/');
};

exports.deleteCategory = (req, res) => {
    const { categoryName } = req.body;
    if (categoryName === "Umum") return res.redirect('/');

    let categories = storage.getCategories().filter(c => c !== categoryName);
    storage.saveCategories(categories);

    let todos = storage.getTodos().map(todo => {
        if (todo.category === categoryName) todo.category = 'Umum';
        return todo;
    });
    storage.saveTodos(todos);
    res.redirect('/');
};