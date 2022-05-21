import * as path from 'path';
import * as express from 'express';
import mysqlRouter from './routes';

const app = express();

let p = path.join(__dirname, '../public');
console.log(p);

app.use(express.json());
app.use(express.static(p));
app.use("/mysql", mysqlRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})
