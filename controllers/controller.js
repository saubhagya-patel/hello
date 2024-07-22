import axios from "axios";
const API_URL="https://openlibrary.org/search.json?q=";

import { 
    getBoookInfo,
    getAllBooks,
    getBookReview,
    updateBookReview,
    addNewBook,
    deleteBook,
} from "./functions.js";

let book=[];

export async function getSummary(req,res){
    let bookIsbn=parseInt(req.params.isbn);
    let bookReview = await getBookReview(bookIsbn);
    let bookInfo = await getBoookInfo(bookIsbn);
    bookReview[0].date_modified=bookReview[0].date_modified.toDateString()
    res.render("book-summary.ejs",{
        bookSummary: bookReview[0],
        bookInfo: bookInfo[0],
    });
}

export function searchBook(req,res){
    res.render("search-book.ejs")
}

export async function sort(req,res){
    const wayToSort=req.params.sortFunction;
    book = await getAllBooks(wayToSort);
    res.render("index.ejs",{
        bookInfo: book,
    });
}

export async function editSummary(req,res){
    const bookIsbn=parseInt(req.params.isbn);
    const updatedReview=req.body.updatedReview;
    const updatedRating=req.body.updatedRating;
    const updatedRowCount = await updateBookReview(bookIsbn,updatedReview,updatedRating);
    if (updatedRowCount===0) {
        res.status(404).redirect(`/book/summary/${bookIsbn}`);
    }else{
        res.redirect(`/book/summary/${bookIsbn}`);
    }  
}

export async function searchResult(req,res){
    const searchCriteria=req.body.searchCriteria;
    let searchItem;
    if(searchCriteria=='bookName') {
        searchItem=req.body.bookName.trim();
        const temp = encodeURIComponent(searchItem).replace(/%20/g, '+');
        searchItem=temp;
    }else {
        searchItem=parseInt(req.body.isbn);
    }
    try {
        const response = await axios.get(`${API_URL}+${searchItem}+&limit=10`);
        const data=response.data.docs;
        res.render("search-result.ejs", {
            data: data,
        })
    } catch (error) {
        console.error("error fetching data : ",error);
    }
}

export async function resultBookGet(req,res){
    const isbn=parseInt(req.params.isbn);
    const response=await axios.get(`${API_URL}+${isbn}`);
    const data=response.data.docs[0];
    res.render("result-book.ejs",{
        data:data,
        isbn:isbn,
    }) 
}

export async function resultBookPost(req,res){
    const bookInfo = {
        isbn: parseInt(req.params.isbn),
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        pages : parseInt(req.body.pages),
        coverid: parseInt(req.body.coverid),
        rating : parseInt(req.body.rating),
        summary : req.body.review.trim(),
    };
    const result = await addNewBook(bookInfo);
    if(result) {
        res.redirect("/");
    }
}

export async function deleteBookGet(req,res){
    const bookIsbn=parseInt(req.params.isbn);
    const bookInfo=await getBoookInfo(bookIsbn);
    res.render("delete-book.ejs",{
        data:bookInfo[0],
    })
}

export async function deleteBookPost(req,res){
    const bookIsbn=parseInt(req.params.isbn);
    const deleteQuery = await deleteBook(bookIsbn);
    if(deleteQuery) {
        res.redirect("/");
    }
}
