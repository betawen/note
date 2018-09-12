let AWS=require("aws-sdk");
AWS.config.update({
    region:"us-west-2",
    endpoint:"http://localhost:8080"
});

const dynamodb=new AWS.DynamoDB();

let params={
    TableName:"notebook",
    AttributeDefinitions:[
        {AttributeName:"tags",AttributeType:"S"}
    ],
    GlobalSecondaryIndexUpdates:[
        {
            Create:{
                IndexName:"index",
                KeySchema:[
                    {AttributeName:"tags",KeyType:"HASH"},//partiton key
                ],
                Projection:{
                    "ProjectionType":"ALL"
                },
                ProvisionedThroughput:{
                    "ReadCapacityUnits":5,"WriteCapacityUnits":5
                }
            }
        }
    ],
};

dynamodb.updateTable(params,function(err,data){
    if(err){
        console.log("Unable to update table. Error JSON: ", JSON.stringify(err,null,2));
    }else{
        console.log("Update table.Table description JSON: ", JSON.stringify(err,null,2));
    }
});