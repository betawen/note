const AWS=require('aws-sdk');
AWS.config.update({
    region:"us-west-2",
    endpoint:"http://localhost:8080"
});

const dynamodb=new AWS.DynamoDB();

let params = {//指定表名，主键属性和数据类型
    TableName: "notebook",
    KeySchema:[
        {AttributeName:"date",KeyType:"HASH"},
        //Partiton key
        {AttributeName:"title",KeyType:"RANGE"}
    ],
    AttributeDefinitions:[
        {AttributeName:"date",AttributeType:"S"},
        {AttributeName:"title",AttributeType:"S"}
    ],
    ProvisionedThroughput:{//吞吐量
        ReadCapacityUnits:10,
        WriteCapacityUnits:10
    }
};
dynamodb.createTable(params,function(err,data){
    if(err){
        console.log("Unable to create table. Error JSON: ",JSON.stringify(err,null,2));
    }else{
        console.log("Create table. Table description JSON: ",JSON.stringify(data,null,2));
    }
});