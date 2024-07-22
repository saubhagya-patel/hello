import express from "express";
const router = express.Router();

import {
    getSummary,
    searchBook,
    sort,
    editSummary,
    searchResult,
    resultBookGet,
    resultBookPost,
    deleteBookGet,
    deleteBookPost,
} from "../controllers/controller.js"

router.get("/summary/:isbn", getSummary)

router.get("/searchBook", searchBook)

router.get("/sort/:sortFunction", sort)

router.post("/edit/:isbn", editSummary)

router.post("/search-book", searchResult)

router.get("/result-book/:isbn", resultBookGet)

router.post("/result-book/:isbn", resultBookPost)

router.get("/delete/:isbn", deleteBookGet)

router.post("/delete/:isbn", deleteBookPost)

export default router