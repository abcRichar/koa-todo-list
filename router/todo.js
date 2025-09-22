const Router = require("koa-router");
const Todo = require("../models/todo");

// 在需要格式化时间的地方添加
const formatDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const router = new Router({
  prefix: "/api",
});

// Get all todos with pagination and search
router.get("/todos", async (ctx) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(ctx.query.page) || 1;
    const pageSize = parseInt(ctx.query.pageSize) || 10;
    const search = ctx.query.search || "";

    const result = await Todo.findAll(page, pageSize, search);
    const formattedRows = result.data.map((row) => ({
      ...row,
      created_at: formatDateTime(row.created_at),
      updated_at: formatDateTime(row.updated_at),
    }));
    ctx.status = result.code;

    ctx.body = {
      code: result.code,
      data: formattedRows,
      message: result.message,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: "Internal server error",
    };
  }
});

// Get todo by ID
router.get("/todos/:id", async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const result = await Todo.findById(id);
    const formattedRows = {
      ...result.data,
      created_at: formatDateTime(result.data.created_at),
      updated_at: formatDateTime(result.data.updated_at),
    };
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: formattedRows,
      message: result.message,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: "Internal server error",
    };
  }
});

// Create new todo
router.post("/todos", async (ctx) => {
  try {
    const { name, age, address, status } = ctx.request.body || {};
    const result = await Todo.create(name, age, address, status);
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: "Internal server error",
    };
  }
});

// Update todo
router.put("/todos/:id", async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const { name, status } = ctx.request.body || {};

    if (name === undefined && status === undefined) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        data: null,
        message: "name or status status is required",
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
        message: existingTodo.message,
      };
      return;
    }

    const result = await Todo.update(
      id,
      name !== undefined ? name : existingTodo.data.name,
      status !== undefined ? status : existingTodo.data.status
    );

    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: "Internal server error",
    };
  }
});

// Delete todo
router.delete("/todos/:id", async (ctx) => {
  try {
    const id = parseInt(ctx.params.id);
    const result = await Todo.delete(id);
    ctx.status = result.code;
    ctx.body = {
      code: result.code,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: "Internal server error",
    };
  }
});

module.exports = router;
