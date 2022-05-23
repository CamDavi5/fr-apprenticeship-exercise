var mysql = require('mysql');
import Fetch from './fetch';

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', //replace this with MySQL username
    password: 'rootPassword', //replace this with MySQL password
    database: 'fetchuser'
});

export const Query = (query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        })
    })
}

export default {
    Fetch
}