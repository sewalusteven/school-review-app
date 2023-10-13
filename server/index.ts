import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { LocalStorage } from "node-localstorage";
import {checkTokenMiddleware} from "./middleware/token-verification";

import sample from "./api/sample";

const app = express()
const localStorage = new LocalStorage('./storage');

app.use(bodyParser.json());
app.use(cors());

app.post('/api/v1/add-token',(req:Request, res:Response) => {
    let {token} =  req.body
    localStorage.setItem('access-token', `Bearer ${token}`);
    res.status(204).json({message:'updated'})
});

app.use(checkTokenMiddleware);


app.use('/api/v1',  sample);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)