const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', (req, res) => {
    const { firstName, lastName, email, psw, pswRepeat } = req.body;
    let errorMsgs = [];

    if (!firstName || !lastName || !email || !psw|| !pswRepeat) {
        errorMsgs.push({ msg: 'Please enter all fields' });
    }

    if (psw != pswRepeat) {
        errorMsgs.push({ msg: 'Passwords do not match' });
    }

    if (psw.length < 6) {
        errorMsgs.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errorMsgs.length > 0) {
        res.render('signup', {
            errorMsgs,
            firstName,
            lastName,
            email,
            psw,
            pswRepeat
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errorMsgs.push({ msg: 'User Already Exists' });
                    res.render('signup', {
                        errorMsgs,
                        firstName,
                        lastName,
                        email,
                        psw,
                        pswRepeat
                    });
                } else {
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        psw
                    });

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.psw, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.psw = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Thanks for registering!')
                                    res.redirect('/account/signin');
                                })
                                .catch(err => console.log(err));
                        }
                    ))
                }
            })
    }
})

router.get('/signin', (req, res) => {
    res.render('signin');
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/GAMEscreen',
        failureRedirect: '/account/signin',
        failureFlash: true
    })(req, res, next)
})

module.exports = router;
