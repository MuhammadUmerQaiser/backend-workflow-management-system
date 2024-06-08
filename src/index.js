// Importing required modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectToMongo = require("./db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

// Connect to MongoDB
connectToMongo();

// Initialize Express app
const app = express();
const port = 5000;

// Set allowed origins for CORS
const allowedOrigins = ["http://localhost:3000"];

// Middleware setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.json());

// Route setup
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use(
  "/assets/uploads",
  express.static(path.join(__dirname, "/assets/uploads"))
);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("send-message", async (messageData) => {
    try {
      io.emit("receive-message", messageData);
      // console.log("Message received:", messageData);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Workflow backend listening on port ${port}`);
});
