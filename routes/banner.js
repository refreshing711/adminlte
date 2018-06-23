var fs = require('fs');
var { MongoClient } =require('mongodb');
var async =require('async');
var url = require('url');

var checkLogin = require ( './checkLogin' );
var mongoUrl = 'mongodb://localhost:27017/admin';

module.exports = {
    defaultRoute : ( req ,res ,next) =>{
        checkLogin.check( req , res );
        async.waterfall( [
            ( cb ) =>{
                MongoClient.connect( mongoUrl , (err , db ) =>{
                    if( err ) throw err;
                    cb( null , db ); 
                })  
            },
            ( db , cb ) =>{
                db.collection('banner').find({},{bannerid:1,bannerurl:1,imgurl:1}).toArray(( err , res ) =>{
                    if ( err  ) throw err;
                    cb( null , res);
                })
            }
        ] , ( err , result ) =>{
            if( err ) throw err;
            res.render('banner',{
                result
            });
        })
    },
    addBannerRouter( req , res , next ){
        checkLogin.check( req , res );
        res.render('banner_add');
    },
    addBannerAction( req , res , next ){
        checkLogin.check( req , res );
        // console.log('req.body' , req.body);
        // console.log('req.file' , req.file );

        var { bannerid , bannerurl } = req.body;

        // req.body { bannerid: 'banner1', bannerurl: 'http://www.baidu.com' }
        // req.file { fieldname: 'bannerimg',
        // originalname: '6.jpg',
        // encoding: '7bit',
        // mimetype: 'image/jpeg',
        // destination: 'uploads/',
        // filename: 'b72e7dfed2e58402ed7e2325d0d91488',
        // path: 'uploads\\b72e7dfed2e58402ed7e2325d0d91488',
        // size: 20697 }

        var oldName = './uploads/' + req.file.filename;
        var finishFlagArr = req.file.originalname.split('.');
        var finishFlag = finishFlagArr[finishFlagArr.length-1];
        var newName = './uploads/' + req.file.filename + "." +finishFlag;
        

        async.waterfall([
            ( cb ) =>{
                fs.rename( oldName , newName , ( err ,data ) =>{
                    if( err ) throw err;
                    var imgurl =  req.file.filename+ '.' +finishFlag;
                    cb( null , imgurl );
                })
            },
            ( imgurl , cb ) =>{
                MongoClient.connect(mongoUrl , ( err , db ) =>{
                    if( err ) throw err;
                    cb( null , imgurl , db ); 
                })
            },
            (imgurl , db , cb ) =>{
                db.collection('banner').insert({ bannerid , bannerurl ,imgurl}, ( err ,res ) =>{
                    if( err ) throw err;
                    cb( null , 'ok');
                    db.close();
                })
            } 
        ] , ( err, result ) =>{
            if( err ) throw err;
            if( result == 'ok'){
                res.redirect('/banner');
            }
        })


        fs.rename( oldName , newName , ( err ,data ) =>{
            if( err ) throw err;
        })
    } 
}