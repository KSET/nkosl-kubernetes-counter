const pg = require("pg");
const Logger = require("./logger");

module.exports = {
  connectToDatabase: async () => {
    Logger.log("Trying to connect to Postgres...", process.env.DATABASE_URL);

    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    Logger.log("Connected to Postgres");

    Logger.log("Creating tables if they don't exist...");

    await client.query(`
create table if not exists counters (
  id serial primary key,
  name text not null,
  count integer not null default 0
)
`);

    return client;
  },
};
