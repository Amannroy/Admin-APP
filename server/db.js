import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-mute-hat-amn3k6j5.c-5.us-east-1.aws.neon.tech",
  database: "neondb",
  password: "npg_sZEHTmB7g8dU",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;