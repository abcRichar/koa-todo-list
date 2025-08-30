const Router = require('koa-router');
const Todo = require('../models/todo');

const router = new Router({
  prefix: '/api'
});

// Get all todos
router.get('/todos', async (ctx) => {
  try {
    const result = await Todo.findAll();
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: 'Internal server error'
    };
  }
});

// Get todo by ID
router.get('/todos/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const result = await Todo.findById(id);
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: 'Internal server error'
    };
  }
});

// Create new todo
router.post('/todos', async (ctx) => {
  try {
    const { title } = ctx.request.body || {};
    const result = await Todo.create(title);
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: 'Internal server error'
    };
  }
});

// Update todo
router.put('/todos/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const { title, completed } = ctx.request.body || {};
    
    if (title === undefined && completed === undefined) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        data: null,
        message: 'Title or completed status is required'
      };
      return;
    }
    
    // Get existing todo to get current values
    const existingTodo = await Todo.findById(id);
    if (existingTodo.code !== 200) {
      ctx.status = existingTodo.code;
      ctx.body = {
        code: existingTodo.code,
        data: existingTodo.data,
        message: existingTodo.message
      };
      return;
    }
    
    const result = await Todo.update(
      id,
      title !== undefined ? title : existingTodo.data.title,
      completed !== undefined ? completed : existingTodo.data.completed
    );
    
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: 'Internal server error'
    };
  }
});

// Delete todo
router.delete('/todos/:id', async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const result = await Todo.delete(id);
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: 'Internal server error'
    };
  }
});

module.exports = router;