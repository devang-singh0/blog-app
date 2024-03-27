import express from "express"
import {router as userRouter} from "./routes/user.js"
import mongoose from "mongoose";
import authenticationMiddleware from "./middlewares/authentication.js";
import cookieParser from "cookie-parser";
import { router as blogRouter } from "./routes/blog.js";
import { Blog } from "./models/blog.js";
mongoose.connect('mongodb://localhost:27017/blogify').then(()=>{console.log('db connected')})
let app = express();

let PORT = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(authenticationMiddleware);
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.get('/', async (req, res)=>{
    let allBlog = await Blog.find({});
    res.render('home.ejs', {user: req.user, blog: allBlog});
})

app.listen(PORT, ()=>{
    console.log('app listening on port', PORT);
})