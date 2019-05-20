const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        firstName: req.user.firstName,
        lastName: req.user.lastName
    })
})

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Succesful Logout');
    res.redirect('/account/signin');
})



router.get('/GAMEscreen', ensureAuthenticated, (req, res) => {
  res.render('GAMEscreen');
})

router.get('/RANKscreen', (req, res) =>{
  res.render('RANKscreen');
})


module.exports = router;
