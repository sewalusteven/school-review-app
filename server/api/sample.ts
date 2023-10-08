import {Prisma, PrismaClient} from "@prisma/client";
import express from 'express';
const router = express.Router();

const prisma = new PrismaClient()

router.get('/sample', async (req, res) => {

    res.json({sample: "it has gone through"})
})

export default router;