import {NextFunction, Request, Response} from "express";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage('./storage');

export const checkTokenMiddleware =  (req:Request, res:Response, next:NextFunction) => {
    if(localStorage.getItem('access-token') !== null){
        let token = localStorage.getItem('access-token');
        if(token !== req.headers.authorization){
            res.status(401).json({error: 'Unauthorized'})
        }
        next()
    }else {
        res.status(401).json({error: 'Unauthorized'})
    }

}