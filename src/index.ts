import axios from "axios";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { exchangeCode } from "./todoist";

const port = process.env.PORT || 3000;
const TODOIST_CLIENT_ID = process.env.TODOIST_CLIENT_ID ?? "";
const TODOIST_SECRET = process.env.TODOIST_SECRET ?? "";

const app = express();
app.use(cors());

app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("----");
  next();
});

app.get("/v1/auth-todoist", async function (req, res) {
  const state = crypto.randomUUID();
  res.redirect(`https://todoist.com/oauth/authorize?client_id=${TODOIST_CLIENT_ID}&scope=data:read_write&state=${state}`)
})

app.post("/v1/auth-todoist-callback", async function (req, res) {
  let {code} = JSON.parse(req.body)

  return exchangeCode(code, TODOIST_CLIENT_ID, TODOIST_SECRET)
    .then((accessToken) => res.send({accessToken}))
    .catch((error) => {
      console.log(`Error: ${error}`);
      console.log("----");
      res.status(500).send({ error: error.message });
    });
});

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
