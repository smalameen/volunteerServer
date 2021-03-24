const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = "mongodb+srv://organicUser:UMZevDLRDB9ftSZ@cluster0.irc3w.mongodb.net/volunteer?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5001;
app.use(express.static('org'));
app.use(fileUpload());


app.get('/', (req, res) =>{
    res.send("Hello I am form DB");
    
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const userDataCollection = client.db("volunteer").collection("data");
  const organizationCollection = client.db("newOrg").collection("orgData");

  app.post('/volunteers', (req, res) => {
    const orders = req.body;
    console.log(orders);
    userDataCollection.insertOne(orders)
    .then(userResult =>{
        res.send(userResult.insertedCount > 0)
    })
})
app.get('/volunteer', (req, res) => {
  userDataCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

app.post('/addOrg', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    console.log(name, email, encImg)

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    organizationCollection.insertOne({ name, email, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

app.get('/newOrg', (req, res) => {
    organizationCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.get('/task', (req, res) => {
    const filter = req.query.filter;
    console.log(filter)
    organizationCollection.find({name: filter})
        .toArray((err, documentsFilter) => {
            res.send(documentsFilter);
        })
});



});

app.listen(process.env.PORT || port);