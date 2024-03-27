import { Router } from "express";
import multer from "multer";
import { Blog } from "../models/blog.js";
import { Comment } from "../models/comments.js";
export let router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/uploads`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    res.render('addBlog', {
        user: req.user
    });
})

router.post('/', upload.single('coverImg'), async (req, res) => {
    await Blog.create({
        title: req.body.title,
        content: req.body.content,
        coverImage: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user.id
    }).then((blog) => {
        res.redirect(`/blog/${blog._id}`);
    }).catch((err) => {
        res.render('addBlog', { error: 'An error occurred' });
    });
})

router.get('/:id', async (req, res) => {
    let blog = await Blog.findById(req.params.id).populate('createdBy');
    let comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    console.log(comments);
    res.render('blog', { blog, user: req.user, comments });
});

router.post('/comment/:blogId', async (req, res) => {
    let comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user.id
    }).then((comment) => {
        res.redirect(`/blog/${req.params.blogId}`);
    }).catch((err) => {
        res.redirect(`/blog/${req.params.blogId}`);
    });
});