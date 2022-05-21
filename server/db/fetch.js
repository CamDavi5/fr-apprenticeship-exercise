import { Query } from './index';

const addTransaction = async (payer, points, timestamp) => Query(`INSERT INTO camdavis (id, payer, points, timestamp) values(null, '${payer}', ${points}, '${timestamp}')`)
const balance = async () => Query(`SELECT * from camdavis`);
//const spend

export default {
    addTransaction,
    balance
}