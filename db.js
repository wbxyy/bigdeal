const {promisify} = require('util')
const fs = require('fs')
const path = require('path')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dbPath = path.join(__dirname,"./db.json")

exports.getDb = async ()=>{
  const data = await readFile(dbPath)
  return JSON.parse(data)
}

exports.saveDb = async (db)=>{
  const data = JSON.stringify(db,null,'  ')
  await writeFile(dbPath,data)
}