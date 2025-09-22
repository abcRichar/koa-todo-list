require("dotenv").config();

const { promisePool } = require("../config/database");

// Create tables
async function initDatabase() {
  try {
    // Create todos table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS todos (
      id int NOT NULL AUTO_INCREMENT COMMENT '编号',
      name varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
      status tinyint(1) NULL DEFAULT 0 COMMENT '状态',
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      address varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '地址',
      age int NULL DEFAULT NULL COMMENT '年龄',
      PRIMARY KEY (id) USING BTREE
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close pool connection
    await promisePool.end();
  }
}

// Run initialization
initDatabase();
