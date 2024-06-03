const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
const path = require('path');
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
app.use("/api",authRoutes)
app.use("/api",adminRoutes)
app.use("/api",userRoutes)
app.use('/assets/uploads', express.static(path.join(__dirname, "/assets/uploads")));

app.listen(port, () => {
  console.log(`Workflow backend listening on port ${port}`);
});





