import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from 'express-session';
import Keycloak from 'keycloak-connect';

import sample from "./api/sample";
const app = express()


const memoryStore = new session.MemoryStore();
app.use(session({
    secret:'someSecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}))


const keycloak = new Keycloak({ store: memoryStore });
app.use(bodyParser.json());
app.use(cors());
app.use( keycloak.middleware());

app.use('/api/v1', sample);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)