require("dotenv").config();

const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const todoRouter = require("./router/todo");

// Create main router with prefix
const apiRouter = new Router({
  prefix: "/api",
});

const app = new Koa();

// Middleware to parse request body
app.use(
  require("koa-bodyparser")({
    enableTypes: ["json", "form"],
    json: {
      strict: false,
    },
  })
);

// Logger
app.use(logger());

// Routes
apiRouter.get("/", (ctx) => {
  ctx.body = { message: "Hello from API!" };
});

// Register routers
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
app.use(todoRouter.routes());
app.use(todoRouter.allowedMethods());

module.exports = app;
