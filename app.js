const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const indexRouter = require("./routes/indexRouter");
const movieRouter = require("./routes/movieRouter");
const genreRouter = require("./routes/genreRouter");
const actorRouter = require("./routes/actorRouter");
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/movie", movieRouter);
app.use("/genre", genreRouter);
app.use("/actor", actorRouter);
app.use(express.static(assetsPath));

app.listen(PORT, "0.0.0.0", () => console.log(`Listening on port ${PORT}`));
