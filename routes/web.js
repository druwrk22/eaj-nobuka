const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Todo
router.get('/', todoController.getIndex);
router.post('/add', todoController.addTodo);
router.post('/delete/:id', todoController.deleteTodo);
router.post('/toggle/:id', todoController.toggleTodo);

// Category
router.post('/categories', todoController.addCategory);
router.post('/categories/delete', todoController.deleteCategory);

module.exports = router;