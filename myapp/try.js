//import express
const  express = require('express');
//record res and output
const  logger = require('morgan');
//to set cookie
const cookieParser = require('cookie-parser');
//to get input
const bodyParser =require('body-parser');
//import aws-sdk
const AWS = require('aws-sdk');
//init app by express
const app = express();
//
const notes=new AWS.DynamoDB();
const notetable=new AWS.DynamoDB.DocumentClient();

app.listen(8081,()=>console.log('notebook listening to port 8081'))
AWS.config.update({
    region:"eu-west-2",
    endpoint:"http://localhost:8000"
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.set('view engine',jade);

app.get('/notebook',(req,res)=>{
    console.dir(req.query)
    let params = {
        Tablename:"notebook",
        ProjectionExpression:": time, :date, :content"
    }
}

)



