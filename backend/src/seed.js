import "dotenv/config";
import mysql from "mysql2/promise";

const rootConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true
};

const dbName = process.env.DB_NAME || "codex_test";

const seedStaffs = [
  ["alice.nguyen@example.com", "Alice Nguyen"],
  ["bao.tran@example.com", "Bao Tran"],
  ["chi.le@example.com", "Chi Le"],
  ["david.pham@example.com", "David Pham"]
];

async function seed() {
  const connection = await mysql.createConnection(rootConfig);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staffs (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
    await connection.query("TRUNCATE TABLE staffs");
    await connection.query("INSERT INTO staffs (email, name) VALUES ?", [seedStaffs]);

    console.log(`Seeded ${seedStaffs.length} staffs into ${dbName}.staffs`);
  } finally {
    await connection.end();
  }
}

seed().catch((error) => {
  console.error("Failed to seed database:", error.message);
  process.exit(1);
});
