var checkLogin = require ( './checkLogin' );

module.exports = {
    defaultRoute : ( req ,res ,next) =>{
        checkLogin.check( req , res );
        res.render('directors');
    }
}