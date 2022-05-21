import * as express from 'express';
const router = express.Router();

import db from '../db';

router.post("/", async (req, res) => {
    const body = req.body;
    let ts = new Date();
    let newTS = ts.toISOString();
    const sliceTS = newTS.slice(0, 19)+"Z";
    //console.log(sliceTS);

    try {
        res.json(await db.Fetch.addTransaction(body.payer, body.points, sliceTS))
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }

});

router.get("/", async (req, res) => {
    
    try {
        res.json(await db.Fetch.balance());
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;