const express = require("express");
const blogRoute = express.Router();
const {createBlogs , get_All_Blog ,get_Blog_Id,Update_Blog, Delete_Blog} = require("../controller/blogController/index")
const auth = require("../auth/index")
const { authenticateToken, userAuthorisation  ,adminAuthorisation,} = auth


blogRoute.post("/create-blog" , authenticateToken,adminAuthorisation, createBlogs)

blogRoute.get("/get-all-blog" , get_All_Blog)

blogRoute.get("/get-blog/:id" , get_Blog_Id)

blogRoute.put("/edit-blog/:id",authenticateToken,adminAuthorisation   ,Update_Blog)

blogRoute.get("/delete-blog/:id" ,authenticateToken,adminAuthorisation   ,Delete_Blog)


module.exports = blogRoute

