import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { LocalStorage } from "node-localstorage";
import {checkTokenMiddleware} from "./middleware/token-verification";



const app = express()
const localStorage = new LocalStorage('./storage');

app.use(bodyParser.json());
app.use(cors());


import schools from "./api/schools";
import curriculum from "./api/curriculum";

app.post('/api/v1/add-token',(req:Request, res:Response) => {
    let {token} =  req.body
    localStorage.setItem('access-token', `Bearer ${token}`);
    res.status(204).json({message:'updated'})
});

app.use(checkTokenMiddleware);


app.use('/api/v1/schools',  schools);
app.use('/api/v1/curriculums',  curriculum);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)