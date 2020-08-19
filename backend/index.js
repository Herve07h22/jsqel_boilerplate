// The major difference between require and import, is that require will automatically scan node_modules to find modules, but import, which comes from ES6, won't.
// const jsqel = require('jsquel/backend')
const jsqel = require("jsqel");
const uuidv4 = require("uuid/v4");

const dbUri =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URI
    : "postgresql://postgres:docker@localhost:5432/postgres";

const app = jsqel({
  dbUri,
  secret: "anysecretkeyyouwant",
  debug: process.env.NODE_ENV !== "production",
  apiUrlBase: process.env.NODE_ENV === "production" ? "/api" : "",
});

console.log("Running mode is :", process.env.NODE_ENV);
console.log("Database URI is :", dbUri);
console.log("Database URI received from env is :", process.env.DATABASE_URI);

// Use built-in modules
const auth = require("jsqel/modules/auth");
const ra = require("jsqel/modules/admin");
const upload = require("jsqel/modules/upload");
const generic_crud = require("./endpoints/generic_crud");
const roles = require("./endpoints/roles");

// SQL Queries executed each time the server is restarted
const migrationBatch = async () => {
  // Migrate & register built-in modules
  await app.migrateAndRegister("auth", auth);
  await app.migrateAndRegister("admin", ra);
  await app.migrateAndRegister("direct", upload);

  // Add an admin user
  await app.jsqeldb.executeQuery(
    "INSERT INTO users (id, username, password, role_id) VALUES ( ${id}, ${username}, ${password}, 2) ON CONFLICT DO NOTHING;",
    { id: uuidv4(), username: "Admin", password: app.encrypt("pwdpwd") }
  );

  // Add member user
  await app.jsqeldb.executeQuery(
    "INSERT INTO users (id, username, password, role_id) VALUES ( ${id}, ${username}, ${password}, 1) ON CONFLICT DO NOTHING;",
    { id: uuidv4(), username: "Member", password: app.encrypt("pwdpwd") }
  );

  // Migrate user-defined schema
  await app.migrate("sql/crm_schema.sql");
  await app.migrate("sql/crm_seeds.sql");

  // Migrate user-defined modules
  console.log(await app.migrateAndRegister("crm", generic_crud));
  console.log(await app.migrateAndRegister("roles", roles));
};

// Launch migrations, then launch server
migrationBatch()
  .then(() => app.run())
  .catch((e) => console.log("Something went wrong during migration : ", e));
