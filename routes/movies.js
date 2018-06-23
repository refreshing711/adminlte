var { MongoClient } =require( "mongodb" );
var url = require( 'url' );
var async = require( 'async' );
var checkLogin = require( './checkLogin');

var mongoUrl = 'mongodb://localhost:27017/admin';

module.exports = {

    defaultRoute : ( req , res , next) =>{
        checkLogin.check( req , res )
        async.waterfall( [
            ( cb ) =>{
                MongoClient.connect( mongoUrl , ( err ,db ) => {
                    if( err ) throw err ;
                    cb( null , db) ;
                })
            },
            ( db , cb ) => {
                db.collection('movies').distinct( 'year' ,  ( err , yearArr ) =>{
                    if( err ) throw err;
                    yearArr.sort( ( a , b ) =>{
                        return a - b ;
                    })
                    cb( null ,  yearArr , db  );
                    
                })
            },
            (  yearArr ,  db ,  cb ) => {
                db.collection('movies').find({} , {_id:0}).toArray( ( err , res ) =>{
                    if( err ) throw err;
                    cb( null , { 
                        res,
                        yearArr
                 });
             //    console.log( res );
                    db.close();
                })
            }

        ] , ( err , result) =>{
            if( err ) throw err;
             res.render('movies' , {
                result: result.res,
                yearArr: result.yearArr
            })
            //res.send(result.res);
        }) 
    },
    sortMoviesRoute:( req , res , next ) =>{
        checkLogin.check( req , res )
        var { type , num } =url.parse( req.url, true).query;
        var sortObj = {};
        num = num * 1;
        try {
            sortObj[type] = num ;
        } catch (e) {
            
        }
        async.waterfall([
            ( cb ) =>{
                MongoClient.connect( mongoUrl , ( err , db ) =>{
                    if( err ) throw err;
                    cb( null ,db ) ;
                })
            },
            ( db , cb ) => {
                db.collection('movies').distinct( 'year' ,  ( err , yearArr ) =>{
                    if( err ) throw err;
                    yearArr.sort( ( a , b ) =>{
                        return a - b ;
                    })
                    cb( null ,  yearArr , db  );
                })
               
            },
            ( yearArr, db , cb ) =>{
                db.collection( 'movies' ).find({},{_id:0}).sort(sortObj).toArray( ( err ,res ) =>{
                    if( err ) throw err;
                    cb( null , { 
                        res,
                        yearArr
                });
                    db.close();
                })
            }
        ] , ( err ,result) =>{
            if( err ) throw err ;
            
            res.render( 'movies' , {
                result: result.res,
                yearArr: result.yearArr
            })
        })
    },
    areaQueryMoviesRoute : ( req , res , next ) =>{
        checkLogin.check( req , res )
           var { type , min , max } = url.parse( req.url , true ).query;
           min = min * 1;
           max = max * 1;
           whereObj={};
           try {
               whereObj[ type ] = {
                $gte : min,
                $lte : max
               }

           } catch (error) {
               
           }
        async.waterfall( [
            ( cb ) =>{
                MongoClient.connect( mongoUrl , ( err , db ) =>{
                    if( err ) throw err;
                    cb( null , db );
              })
            },
            ( db , cb ) => {
                db.collection('movies').distinct( 'year' ,  ( err , yearArr ) =>{
                    if( err ) throw err;
                    yearArr.sort( ( a , b ) =>{
                        return a - b ;
                    })
                    cb( null ,  yearArr , db  );
                })
               
            },
            ( yearArr ,  db  , cb ) =>{
                db.collection( 'movies' ).find( whereObj , {_id:0}).toArray( ( err , res ) => {
                    if( err ) throw err;
                    cb( null , {
                        res,
                        yearArr
                    })
                })
            }
        ] , ( err , result ) =>{
            if( err ) throw err;
            res.render( 'movies' ,{
                result : result.res,
                yearArr: result.yearArr
            })
        } )
       },
       searchMoviesRoute:( req , res , next ) =>{
        checkLogin.check( req , res )
            // var { title } = url.parse( req.url , true ).query;

            // var  whereObj={
            //     title : eval('/'+title+'/')
            // };
            // try {
            //     whereObj[title] = title;
            // } catch (error) {
                
            // }
            var { type , val } = url.parse( req.url , true ).query;
            var  whereObj = {};
           try {
               whereObj[type] =eval('/'+val+'/')
           } catch (e) {
               
           }
        async.waterfall( [
            ( cb ) =>{
                MongoClient.connect( mongoUrl , ( err , db ) =>{
                    if( err ) throw err;
                    cb( null , db);
                })
            },
            ( db , cb ) => {
                db.collection('movies').distinct( 'year' ,  ( err , yearArr ) =>{
                    if( err ) throw err;
                    yearArr.sort( ( a , b ) =>{
                        return a - b ;
                    })
                    cb( null ,  yearArr , db  );
                })
               
            },
            ( yearArr , db , cb ) =>{
                db.collection( 'movies' ).find(whereObj,{_id:0}).toArray( (err , res ) =>{
                    if( err ) throw err;
                    cb( null , {
                        res,
                        yearArr
                    }) 
                })
            }
        ] , ( err ,result) =>{
            if( err ) throw err;
            res.render('movies' , {
                result:result.res,
                yearArr:result.yearArr
            })
        } )
       },
       getYearMovies:( req , res , next ) =>{
        checkLogin.check( req , res )
           var { year } = url.parse(req.url , true ).query;
           year = year *1;
           async.waterfall( [
               ( cb ) =>{
                MongoClient.connect( mongoUrl , ( err , db ) =>{
                    if( err ) throw err;
                    cb( null , db )
                }) 
               },
               ( db , cb ) => {
                db.collection('movies').distinct( 'year' ,  ( err , yearArr ) =>{
                    if( err ) throw err;
                    yearArr.sort( ( a , b ) =>{
                        return a - b ;
                    })
                    cb( null ,  yearArr , db  );
                })
               
            },
               ( yearArr , db , cb ) =>{
                   db.collection( 'movies').find( {year}, {_id:0} ).toArray( ( err , res ) =>{
                       if( err ) throw err;
                       cb( null , {
                           res,
                           yearArr
                       })
                       db.close();
                   })
               }
           ] , ( err , result ) =>{
                if( err ) throw err;
                res.render( 'movies' , {
                    result:result.res,
                    yearArr:result.yearArr
                })
           })
       }
      
}