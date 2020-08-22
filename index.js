const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
// const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(cors())
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .get("/", (req, res) => { res.json("YOGESH ITS WORKING "); })
  .post("/signin", (req, res) => {

    res.json("signin page open ");
    // console.log("post signin ", ++p);
    // // console.log("signin req.body", JSON.parse(req.body));

    // console.log(req.body);

    // db
    //     .select('email', 'hash')
    //     .from('login')
    //     .where('email', '=', req.body.email)
    //     .then(user => {
    //         console.log("hash value  = ", user);
    //         console.log("hash value  = ", user[0].hash);
    //         const isValid = bcrypt.compareSync(req.body.password, user[0].hash);
    //         console.log("Validation = ", isValid);
    //         if (isValid) {
    //             return db.select('*')
    //                 .from('users')
    //                 .where('email', '=', req.body.email)
    //                 .then(user => {
    //                     res.json(user[0])
    //                 })
    //                 .catch(err => res.status(400).json('unable to get users'))

    //         } else {
    //             return res.status(400).json('wrong credentials plz try again')
    //         }
    //     })
    //     .catch(err => console.log("error = ", err));

  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
