const path = require("path");
const dotenv = require("dotenv").config();
const express = require("express");

const db = require("./config/db-config");
const app = express();

if (process.env.NODE_ENV === "development") {
    const morgan = require("morgan");
    const morganBody = require("morgan-body");
    /* It's a middleware that logs all requests, including the body, to the console. */
    morganBody(app);
    app.use(morgan("combined"));
}

// Paramètre de la Base de donnée

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const likeRoutes = require("./routes/like.routes");
const categoriesRoutes = require("./routes/categories.routes");
const commentRoutes = require("./routes/comment.routes");

/* A middleware that parses the body of the request and makes it available on the `req.body` property. */
app.use(express.json());

/* Connecting to the database. */
db.connect((err) => {
    if (err) {
        res.status(500).json({ error: "Impossible de se connecter à la base de donnée" });
    }
    console.log("Database connected !!");
});

/* A middleware that allows the server to accept requests from other domains. */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

/* Serving the images folder as a static folder. */
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/like", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

module.exports = app;
