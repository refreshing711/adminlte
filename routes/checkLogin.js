
module.exports={
    check : ( req , res ) =>{
        if ( req.cookies.loginState != 1){
            res.render('login');
            return;
        }
    }
}