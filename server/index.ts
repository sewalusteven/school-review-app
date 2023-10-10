import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { LocalStorage } from "node-localstorage";

import sample from "./api/sample";
const app = express()
const localStorage = new LocalStorage('./storage');

app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/add-token',(req, res) => {
    let {token} =  req.body
    localStorage.setItem('access-token', `Bearer ${token}`);
});

const checkTokenMiddleware =  (req:Request, res:Response, next:NextFunction) => {
   if(localStorage.getItem('access-token') !== null){
       let token = localStorage.getItem('access-token');
       if(token !== req.headers.authorization){
           res.status(401).json({error: 'Unauthorized'})
       }
       next()
   }
    res.status(401).json({error: 'Unauthorized'})
}

app.use(checkTokenMiddleware);


app.use('/api/v1',  sample);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)