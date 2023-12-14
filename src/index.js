const connectToMongo=require("./db");
const express = require('express')
var cors = require('cors')
const authRoutes = require("./routes/user")
const bodyParser = require('body-parser');

connectToMongo();
const app = express()
app.use(bodyParser.json());
const port = 5000

app.use("/auth",authRoutes)


app.use(cors())


app.use(express.json())

app.listen(port, () => {
    console.log(`Worflow backend listening on port ${port}`)
  })

