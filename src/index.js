require("dotenv").config();

const express = require("express");
const Logger = require("./lib/logger");
const Redis = require("./lib/redis");
const Postgres = require("./lib/postgres");
const { randomId } = require("./lib/helpers");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";

async function main() {
  const app = express();
  const redis = await Redis.connectToRedis();
  const db = await Postgres.connectToDatabase();

  app.use(express.json());
  app.use(async (req, res, next) => {
    const requestId = randomId();

    Logger.log(`[${req.method}] | ${requestId} | ${req.url}`);

    const requestCount = await redis.incr("requests");

    req.data = {
      requestCount,
      requestId,
    };

    res.setHeader("X-Request-Count", req.data.requestCount);
    res.setHeader("X-Request-Id", req.data.requestId);
    res.setHeader("X-Instance-Id", Logger.INSTANCE_ID);

    next();
  });

  app.get("/", async (req, res) => {
    const resp = await db.query("select name, count from counters");

    res.json({
      counters: resp.rows,
    });
  });

  app.post("/", async (req, res) => {
    const name = String(req.body.name).trim();

    if (!name) {
      return res.status(400).json({
        error: "Parameter `name` is required",
      });
    }

    const exists = await db.query({
      text: `select * from counters where name = $1 limit 1`,
      values: [name],
    });

    if (exists.rowCount > 0) {
      return res.status(400).json({
        error: `Counter with name \`${name}\` already exists`,
      });
    }

    await db.query({
      text: `insert into counters (name, count) values ($1, 0)`,
      values: [name],
    });

    res.json({
      name,
      count: 0,
    });
  });

  app.get("/:name", async (req, res) => {
    const name = String(req.params.name).trim();

    if (!name) {
      return res.status(400).json({
        error: "Parameter `name` is required",
      });
    }

    const countRes = await db.query({
      text: `select count, name from counters where name = $1 limit 1`,
      values: [name],
    });

    const counterRow = countRes.rows[0];

    if (!counterRow) {
      return res.status(400).json({
        error: `Counter with name \`${name}\` does not exist`,
      });
    }

    return res.json({
      name: counterRow.name,
      count: counterRow.count,
    });
  });

  app.post("/:name", async (req, res) => {
    const name = String(req.params.name).trim();

    if (!name) {
      return res.status(400).json({
        error: "Parameter `name` is required",
      });
    }

    try {
      const countRes = await db.query({
        text: `update counters set count = count + 1 where name = $1 returning count, name`,
        values: [name],
      });

      const counterRow = countRes.rows[0];

      return res.json({
        name: counterRow.name,
        count: counterRow.count,
      });
    } catch (e) {
      return res.status(400).json({
        error: `Counter with name \`${name}\` does not exist`,
      });
    }
  });

  Logger.log(`Starting application on port ${PORT}`);
  app.listen(PORT, HOST, () => {
    Logger.log(
      `Application instance \`${Logger.INSTANCE_ID}\` started and listening on port http://${HOST}:${PORT}`
    );
  });
}

void main().catch((e) => {
  Logger.error("Got an error while starting application:");
  Logger.error(e);
});
