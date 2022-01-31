const mysql = require('mysql')
const {promisify} = require('util')


const db = mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'admin123',
  database:'my_db_1'
})

const query = promisify(db.query.bind(db))

module.exports = {
  db,query
}