const mysql = require("mysql2");
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = 8000

const DB_HOST = String(process?.env?.DB_HOST).replaceAll('\n', '')
const DB_USERNAME = String(process?.env?.DB_USERNAME).replaceAll('\n', '')
const DB_PASSWORD = String(process?.env?.DB_PASSWORD).replaceAll('\n', '')
const DB_NAME = String(process?.env?.DB_NAME).replaceAll('\n', '')

const pool = mysql.createPool({
  connectionLimit: 5,
  host: DB_HOST,
  user: 'root',
  database: DB_NAME,
  password: DB_PASSWORD
});


// create database and USER table if not exist
pool.query(`CREATE DATABASE IF NOT EXISTS  ${DB_NAME}`, function (err) {
  if (err) throw Error('\n\t **** error creating database **** ' + err)
  
  console.log('\n\t ==== database created !! ====')
  
  pool.query(`USE ${DB_NAME}`, function (err) {
  if (err) throw Error('\n\t **** error using database **** ' + err);
  
  console.log('\n\t ==== database switched !! ====')

  pool.query(`CREATE TABLE IF NOT EXISTS users(
    id_user int (10) AUTO_INCREMENT,
    name varchar(20) NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(15) NOT NULL,
    PRIMARY KEY (id_user)
  )`,
  function (err) {
    if (err) throw Error('\n\t **** error creating table **** ' + err);
  })
  })
})

app.get("/users/get", function(req, res){
  pool.query("SELECT * FROM users", function(err, data) {
    if(err) return console.log(err);
    res.json(data)
  });
});

app.post("/users/create", function (req, res) {
  console.log(req.body)
  if(!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  pool.query("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, password], function(err, data) {
    if(err) return console.log(err);
    res.json({
      msg: 'Новый пользователь успешно добавлен'
    });
  });
});

app.patch("/users/edit", function (req, res) {
  console.log(req.body)
  if(!req.body) return res.sendStatus(400);
  const { id_user, name, email, password } = req.body

  pool.query("UPDATE users SET name=?, email=?, password=? WHERE id_user=?", [name, email, password, id_user], function(err, data) {
    if(err) return console.log(err);
    res.json({ msg: 'Пользователь успешно изменён' });
  });
});

app.delete("/users/delete/:id", function(req, res){
  const id_user = req.params.id;
  pool.query("DELETE FROM users WHERE id_user=?", [id_user], function(err, data) {
    if(err) return console.log(err);
    res.json({ msg: 'Пользователь успешно удалён' });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})