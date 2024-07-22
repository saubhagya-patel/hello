import express from "express";
import bodyParser from "body-parser";
import serverless from "serverless-http";

import env from 'dotenv';
import { getAllBooks } from "../../controllers/functions";
import router from "../../routes/router";
env.config();

getAllBooks

const app = express();
// const router = express.Router();
const port = 3000;

app.use(express.static("../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/book", router)


let book = [];

app.get("/", async (req, res) => {
    book = await getAllBooks();
    res.render("index.ejs", {
        bookInfo: book,
    });
})

app.get("/features", (req, res) => {
    res.render("features.ejs");
})

// app.listen(port, () => {
//     console.log(`Server is listening at http://localhost:3000`);
// })

app.use("/.netlify/functions/app", router);
export const handler = serverless(app);