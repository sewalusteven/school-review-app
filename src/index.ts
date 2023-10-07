import express from 'express'
import bodyParser from "body-parser";
const cors = require("cors")
import sample from "./api/sample";


const app = express()
app.use(bodyParser.json());
app.use(cors());



app.use('/api/v1', sample);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)
