import { neon, neonConfig } from "@neondatabase/serverless";
import ws from 'ws';

const dbUrl = process.env.DATABASE_URL;

// Determine if we are connecting to the local Docker proxy setup.
// We check if the URL contains the standard local host/port pattern (localhost:5432).
const isLocalDevelopment = dbUrl && (
  dbUrl.includes("db.localtest.me:4444")
  //dbUrl.includes("localhost:5432") ||
  //dbUrl.includes("127.0.0.1:5432")
);

if (isLocalDevelopment) {
  console.log("Detected local database connection. Applying Neon Proxy configuration...");

  // Configure the Neon Serverless Driver to communicate with the local Docker proxy.
  // This uses the special 'db.localtest.me:4444' endpoint set up in your docker-compose.yml.
  neonConfig.webSocketConstructor = ws;
  neonConfig.useSecureWebSocket = false;
  neonConfig.wsProxy = (host, port) => 'db.localtest.me:4444';
  neonConfig.pipelineConnect = false;
  neonConfig.fetchEndpoint = 'http://db.localtest.me:4444/sql';
  neonConfig.poolQueryViaFetch = false;

  // NOTE: The connection string remains the standard postgres:// URL (e.g., postgres://postgres@localhost:5432/quiz-gen-ts),
  // but the neonConfig ensures the traffic is rerouted correctly via the proxy.

} else {
  console.log("Detected production/remote connection. Using standard Neon configuration.");
  // No special configuration needed for remote Neon WSS/HTTPS endpoints.
}

// SQL connection
export const sql = neon(dbUrl!);

export async function initDb() {
  try {
    console.log("Checking database schema and creating tables if necessary...");

    // Test connectivity by checking the DB version
    const [dbVersion] = await sql`SELECT version();`;
    console.log(`Connection successful. Postgres Version: ${dbVersion.version.substring(0, 50)}...`);

    // users
    await sql
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,                 -- required + unique
        email VARCHAR(255) NOT NULL UNIQUE,                    -- required + unique
        password VARCHAR(255) NOT NULL,                        -- required
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- record creation time
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()  -- record update time
      )`;

    // refresh_tokens
    await sql
      `CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),            -- unique identifier for each token row
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- foreign key to users table
        token_hash VARCHAR(255) NOT NULL UNIQUE,                  -- required + unique
        jti VARCHAR(255) NOT NULL,                                -- required
        expires_at TIMESTAMPTZ NOT NULL,                          -- required
        revoked_at TIMESTAMPTZ DEFAULT NULL,                      -- nullable
        replaced_by VARCHAR(255) DEFAULT NULL,                    -- new jti when rotated
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),            -- record creation time
        ip VARCHAR(255),                                          -- optional
        user_agent TEXT                                           -- optional
      )`;
    // quizzes
    await sql
      `CREATE TABLE IF NOT EXISTS quizzes(
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT FALSE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )`;
    // questions
    await sql
      `CREATE TABLE IF NOT EXISTS questions(
        id UUID PRIMARY KEY,
        text TEXT NOT NULL,
        type SMALLINT DEFAULT 0,
        display_order INT DEFAULT 0,
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE
      )`;
    // answer_options
    await sql
      `CREATE TABLE IF NOT EXISTS answer_options(
        id UUID PRIMARY KEY,
        text TEXT NOT NULL,
        display_order INT DEFAULT 0,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE
      )`;
    // correct_answers
    await sql
      `CREATE TABLE IF NOT EXISTS correct_answers(
        id UUID PRIMARY KEY,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        answer_option_id UUID NOT NULL REFERENCES answer_options(id) ON DELETE CASCADE
      )`;
    // submissions
    await sql
      `CREATE TABLE IF NOT EXISTS submissions(
        id UUID PRIMARY KEY,
        result VARCHAR(255) DEFAULT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE
      )`;
    // attempted_answers
    await sql
      `CREATE TABLE IF NOT EXISTS attempted_answers(
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        answer_option_id UUID NOT NULL REFERENCES answer_options(id) ON DELETE CASCADE
      )`;

    console.log("DB initted successfully")
  } catch (error) {
    console.log("DB init error:", error);
    process.exit(1); // 1 === status code FAILURE
  }
}