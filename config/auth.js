module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'You are not Logged In');
            res.redirect('/account/signin');
        }
    }
}