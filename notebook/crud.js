//import express
const express=require("express");
const logger =require("morgan");
const cookieParser=require("cookie-parser");
const bodyParser= require("body-parser");
const AWS =require("aws-sdk");

AWS.config.update({
    region:"us-west-2",
    endpoint:"http://localhost:8080"
});
const docClient=new AWS.DynamoDB.DocumentClient();
const table="notebook";

let app=express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.set("view engine",'jade');


//first page
app.get('/',(req,res)=>{
    res.redirect("/allnotes/")
});

//all notes
app.get('/allnotes',(req,res)=>{
    console.log("I get a req");
    let params={
        TableName:table,
    };
    docClient.scan(params,(err,data)=>{
        if(err){
            console.log("Unable to read Item. Error JOSN:",JSON.stringify(err,null,2));
        }else{
            console.log("ScanItem succeeded: ",JSON.stringify(data,null,2));
            res.json(data.Items);
        }
    });
});

//addnote
app.post('/addnote',(req,res)=>{
    let title=req.body.title;
    let content=req.body.content;
    let date=new Date().toLocaleDateString();
    let time=new Date().toLocaleTimeString();
    console.log("Trying to add a note");
    let params={
        TableName:table,
        Item:{
            'date':date,
            'title':title,
            'time':time,
            'content':content
        },
    };
    console.log("Adding a new item...");
    if(title==null){
        res.stringify('REFUSED');
    }else{
    docClient.put(params,(err,data)=>{
        if(err){
            console.log("Failed to add a new item. Error JSON:",JSON.stringify(err,null,2));
        }else{
            console.log("Succeeded to add a new item: ", JSON.stringify(data,null,2));
            res.json(data);
        }
    });
}
});

//deletenote
app.post('/deletenote',(req,res)=>{
    console.log("Trying to delete an item...");
    let date=req.body.date;
    let title=req.body.title;
    let params={
        TableName:table,
        Key:{
            "title":title,
            "date":date
        }
    }
    console.log("Deleting an item...");
    docClient.delete(params,(err,data)=>{
        if(err){
            console.log("Failed to delete an item. Error JSON: ",JSON.stringify(err,null,2));
        }else{
            console.log("Succeeded to delete an item. ",JSON.stringify(data,null,2));
            res.json(data);
        }
    });
});

//findnote/date
app.post('/findnote/date/',(req,res)=>{
    console.log("Trying to find a note by date...");
    let date=req.body.date;
    let params={
        TableName:table,
        KeyConditionExpression:'#date=:date',
        ExpressionAttributeNames:{
            "#date":'date'
        },
        ExpressionAttributeValues:{
            ':date':date
        }
    };
    console.log("Finding an item by date...");
    docClient.query(params,(err,data)=>{
        if(err){
            console.log("Fialed to query the item by date. Error JOSN: ",JSON.stringify(err,null,2));
        }else{
            console.log("Succeeded to query the item by date.");
            res.json(data.Items);
        }
    });
});

//findnote/title
app.post('/findnote/',(req,res)=>{
    console.log("Trying to find a note...");
    let title=req.body.title;
    let date=req.body.date;
    let params={
        TableName:table,
        KeyConditionExpression:'#title=:title and #date=:date',
        ExpressionAttributeNames:{
            "#title":'title',
            '#date':'date'
        },
        ExpressionAttributeValues:{
            ':title':title,
            ':date':date
        }
    };
    console.log("Finding an item by title...");
    docClient.query(params,(err,data)=>{
        if(err){
            console.log("Fialed to query the item by title. Error JOSN: ",JSON.stringify(err,null,2));
        }else{
            console.log("Succeeded to query the item by title.");
            res.json(data.Items);
        }
    });
});

//updatenote
app.post('/updatenote/',(req,res)=>{
    console.log("Trying to update an item...");
    let date=req.body.date;
    let title=req.body.title;
    let new_date=new Date().toLocaleDateString();
    let new_time=new Date().toLocaleTimeString();
    let new_title= req.body.title;
    let new_content=req.body.content;
    let params={
        TableName:table,
        Key:{
            'date':date,
            'title':title
        },
        UpdateExpression:"set #time=:time,#content=:content",
        ExpressionAttributeNames:{
            "#time":'time',
            // "#title":'title',
            "#content":'content',
            // "#date":'date'
        },
        ExpressionAttributeValues:{
            ':time':new_time,
            // ':title':new_title,
            ':content':new_content,
            // ':date':new_date,
        },
        ReturnValues:'UPDATED_NEW'
    };
    console.log("Updating an item...");
    docClient.update(params,(err,data)=>{
        if(err){
            console.log("Failed to update an item. Error JSON: ",JSON.stringify(err,null,2));
        }else{
            console.log("Succeeded to update an item.");
            res.json(data);
        }
    });
});

app.listen(3000,()=>{console.log("running on http://localhost:3000")});

module.exports=app;