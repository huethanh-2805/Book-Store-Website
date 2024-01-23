const app = require("express");
const router = app.Router();

const accountController = require("../controllers/account.c");
const passport = require('passport');

const cookieParser = require("cookie-parser");

router.use(cookieParser());

const ensureAuthenticate=require('../middlewares/ensureauthenticate')

router.get('/signin', ensureAuthenticate,accountController.getLogin);
router.get('/signup',accountController.getSignup);
router.post('/signup', accountController.postSignup);
//router.get('/', accountController.home);
// router.post('/signin', passport.authenticate('local', {
//     failureFlash: false
//   }), accountController.postSignin);
router.post('/signin', accountController.postPassport);

router.get('/signout', accountController.getSignOut);

module.exports = router;