import mysql from "mysql2/promise";

const database = process.env.DB_NAME || "codex_test";

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database,
  waitForConnections: true,
  connectionLimit: 10
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staffs (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
    await connection.query(
      `
        INSERT IGNORE INTO staffs (email, name)
        VALUES
          (?, ?),
          (?, ?),
          (?, ?),
          (?, ?)
      `,
      [
        "alice.nguyen@example.com",
        "Alice Nguyen",
        "bao.tran@example.com",
        "Bao Tran",
        "chi.le@example.com",
        "Chi Le",
        "david.pham@example.com",
        "David Pham"
      ]
    );
  } finally {
    await connection.end();
  }
}
