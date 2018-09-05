var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing notes into DynamoDB. Please wait.");

var allNotes = JSON.parse(fs.readFileSync('notes.json', 'utf8'));
allNotes.forEach(function(note) {
    var params = {
        TableName: "mynotes",
        Item: {
            "date":  note.date,
            "title": note.title,
            "info":  note.info
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add note", note.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", note.title);
       }
    });
});
