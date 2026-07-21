import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
const parsedDatabaseUrl = databaseUrl ? new URL(databaseUrl) : null;
const database = parsedDatabaseUrl
  ? parsedDatabaseUrl.pathname.replace(/^\//, "")
  : process.env.DB_NAME || "codex_test";

export const dbConfig = {
  host: parsedDatabaseUrl?.hostname || process.env.DB_HOST || "localhost",
  port: Number(parsedDatabaseUrl?.port || process.env.DB_PORT || 3306),
  user: parsedDatabaseUrl
    ? decodeURIComponent(parsedDatabaseUrl.username)
    : process.env.DB_USER || "root",
  password: parsedDatabaseUrl
    ? decodeURIComponent(parsedDatabaseUrl.password)
    : process.env.DB_PASSWORD || "",
  database,
  waitForConnections: true,
  connectionLimit: 10
};

export const pool = mysql.createPool(dbConfig);

export async function initializeDatabase() {
  const connection = await mysql.createConnection(
    parsedDatabaseUrl
      ? dbConfig
      : {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password
        }
  );

  try {
    if (!parsedDatabaseUrl) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    }

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
