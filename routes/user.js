import { Router } from "express";
import { User } from "../models/user.js";
import { setTokenToUser } from "../services/auth.js";
export let router = Router();

router.get('/signin', (req, res) => {
    res.render('signin');
})
router.get('/signup', (req, res) => {
    res.render('signup');
})
router.get('/logout', (req, res) => {
    res.clearCookie('uid').redirect('/');
})


router.post('/signup', async (req, res) => {
    let { fullName, email, password } = req.body;

    await User.create({ fullName, email, password })
        .then(result => {
            const token = setTokenToUser(result);
            res.cookie('uid', token);
            res.redirect('/');
        }).catch(error => {
            res.render('signup', { error: 'Email already exists' });
        })
});

router.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    await User.matchPassword(email, password)
        .then((token) => {
            if (token) {
                res.cookie('uid', token);
                res.redirect('/');
            }
            else {
                res.render('signin', { error: 'Invalid email or password'});
            }
        });
})