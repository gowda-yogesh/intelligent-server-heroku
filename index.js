const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");
const PORT = process.env.PORT || 5000;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

let u = 0, g = 0, p = 0;

express()
  .use(bodyParser.json())
  .use(cors())
  .get("/", (req, res) => { res.json("YOGESH ITS WORKING "); })
  .post("/signin", (req, res) => {

    // res.json("signin page open ");
    console.log("post signin ", ++p);
    // console.log("signin req.body", JSON.parse(req.body));

    console.log(req.body);

    db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', req.body.email)
      .then(user => {
        console.log("hash value  = ", user);
        console.log("hash value  = ", user[0].hash);
        // const isValid = bcrypt.compareSync(req.body.password, user[0].hash);
        let isValid;
        if (user[0].hash == req.body.password) {
          isValid = true;
        } else {
          isValid = false;
        }
        console.log("Validation = ", isValid);
        if (isValid) {
          return db.select('*')
            .from('users')
            .where('email', '=', req.body.email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get users'))

        } else {
          return res.status(400).json('wrong credentials plz try again')
        }
      })
      .catch(err => console.log("error = ", err));

  })
  .post("/register", (req, res) => {

    // res.json("register page open ");

    console.log("hello its the reguster");

    const { name, password, email } = req.body;

    console.log("name", name);
    console.log("password", password);
    console.log("password type", typeof (password));

    // const saltRounds = 10;
    // const hash = bcrypt.hashSync(String(password), saltRounds);
    // console.log(hash);

    // const correct = bcrypt.compareSync("123456", hash); // true
    // const wrong = bcrypt.compareSync("preetu", hash); // false

    // console.log("correct", correct);
    // console.log("worng", wrong);

    const pro = db.select('*').from('users');
    console.log("database", pro);
    console.log(" transition satarting now");
    db.transaction(trx => {
      console.log("insde transition");
      trx.insert({
        hash: password,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          //return is extremely imp else program hangs;
          console.log("trnasition commplte and connection to users");
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => { res.json(user[0]) })
          // .catch(err => console.log("error in transition of database ", err))
        })
        //most important line trx.commit
        .then(trx.commit)
        .catch(trx.rollback)


    }).catch(err => { res.status(400).json("could not register") });

  })

  .get("/profile/:id", (req, res) => {

    res.json("profile and id as params page open ");

    // console.log("profile");
    // const { id } = req.params;
    // console.log("id", id);

    // db
    //   .select('*')
    //   .from('users')
    //   .where({ id: id })
    //   .then(user => {
    //     if (user.length > 0) {
    //       res.json(user);
    //     } else {
    //       res.status(400).json("Invalid ");
    //     }
    //   })
    //   .catch(err => res.status(400).json("Error: Sorry cant respond to ur request "));


  })

  .put("/image", (req, res) => {

    res.json("image page open ");

    // console.log("image");
    // const { id } = req.body;
    // console.log(req.body);
    // console.log("id", id);

    // let found = false;
    // dataBase.map((person) => {
    //   console.log("map");
    //   console.log(person);
    //   if (person.id == id) {
    //     found = true;
    //     ++person.rank
    //     res.json(person);
    //     return;
    //   }
    // })
    // if (found === false) {
    //   res.status(404).json("was unsucessfull response ")
    // }
  })


  .listen(PORT, () => console.log(`Listening on ${PORT}`))
