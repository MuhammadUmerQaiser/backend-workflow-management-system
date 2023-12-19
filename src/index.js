const authRoutes = require("./routes/user")
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToMongo=require("./db");

connectToMongo();
const app = express();
const port = 5000;

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.use(bodyParser.json());
app.use("/auth",authRoutes)


app.listen(port, () => {
  console.log(`Workflow backend listening on port ${port}`);
});





