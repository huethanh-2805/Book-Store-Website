const db=require('../utils/db')
const jwt = require('jsonwebtoken')
const Account= require('../models/account.m');
const Book=require('../models/Book')
const Category=require('../models/Category')

class CategoryController{
    async index(req,res,next){ 
        let username;
        let role;
        const token = req.cookies.token;

        // Lấy token từ cookie
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ." });
            } else {
                username = decoded.username;
                role=decoded.role;
            }
        });
        
        const account = await Account.findAccount(username);
        if (!account) {
            res.clearCookie('token');
            return res.redirect('/');
        }

        const catgories=await Category.getAll();
        const authors = await Book.getAllAuthors();
        const currentPageReq = req.params.page || 1;
        const currentPage = 'page=' + currentPageReq;
        const itemsPerPage = 9;

        const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
        const totalBooks = await Book.getCount();
        const totalPages = Math.ceil(totalBooks / itemsPerPage);
        const cateName = "all";

        res.render('categorypage', { catgories, authors, books, currentPage, totalPages, cateName, user:account, role: role });
    }

    async getBooksByCategory(req, res, next) {
        try {
            const cateName = req.params.categoryName;
            let cateID;
    
            if (cateName.toLowerCase() === 'all') {
                const itemsPerPage = 9;
                const currentPage = req.params.page || 1;
                const books = await Book.getAllWithPagination(currentPage, itemsPerPage);
                const totalBooks = await Book.getCount();
                const totalPages = Math.ceil(totalBooks / itemsPerPage);
    
                return res.json({ books, totalPages, currentPage });
            } else {
                cateID = await Category.getCatIDByName(cateName);
            }
    
            const currentPage = req.params.page || 1;
            const itemsPerPage = 6;
    
            const books = await Book.getBookByIDCategoryWithPagination(cateID, currentPage, itemsPerPage);
            const totalBooks = await Book.getCountByCategory(cateID);
            const totalPages = Math.ceil(totalBooks / itemsPerPage);

            res.json({ books, totalPages, currentPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }    
}

module.exports=new CategoryController;