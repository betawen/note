//import express
let express = require('express');
// let path = require('path');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let AWS = require("aws-sdk");
let app = express();

app.listen(8081, () => console.log('Notepad API listening on port 8081!'))
AWS.config.update({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
});
let table = new AWS.DynamoDB.DocumentClient();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');

app.get('/notepad', (req, res) => { //显示Notepad表中的所有项目信息
    console.dir(req.query)
    let params = {
        TableName: "Notepad",
        ProjectionExpression: "#name, #date, #detail, #im, #updatetime",
        ExpressionAttributeNames: {
            "#name": "name",
            "#date": "date",
            "#detail": "detail",
            "#im": "im",
            "#updatetime": "updatetime"
        }
    };
    table.scan(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send(value)
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.post('/notepad/add', (req, res) => { //为表增加项目（需要输入名字，创建日期，内容和重要程度）
    let Name = req.body.name
    let Date = req.body.date
    let Detail = req.body.detail.split(",")
    let Im = parseInt(req.body.im)
    console.dir(req.body)
    let params = {
        TableName: "Notepad",
        Item: {
            "name": Name,
            "date": Date,
            "detail": Detail,
            "im": Im
        }
    }
    table.put(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send("Succeeded")
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.post('/notepad/delete', (req, res) => { //为表删除一个项目（需要输入名字和创建时间）
    let Name = req.body.name
    let Date = req.body.date
    console.dir(req.body)
    let params = {
        TableName: "Notepad",
        Key: {
            "name": Name,
            "date": Date
        }
    }
    table.delete(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send("Succeeded")
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.get('/notepad/find_name', (req, res) => { //查找特定名字的项目
    let Name = req.query.name
    console.dir(req.query)
    let params = {
        TableName: "Notepad",
        KeyConditionExpression: "#name = :name",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": Name
        }
    };
    table.query(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send(value)
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.post('/notepad/find_both', (req, res) => { //查找特定名字和创建时间项目
    console.dir(req.body);
    let Name = req.body.name
    let Date = req.body.date
    let Detail = req.body.detail
    let params = {
        TableName: "Notepad",
        Key: {
            "name": Name,
            "date": Date
        }
    }
    table.get(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send(value)
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.get('/notepad/find_im', (req, res) => { //查找特定重要程度的项目
    let Im = parseInt(req.query.im)
    console.dir(req.query)
    console.log(Im)
    let params = {
        TableName: "Notepad",
        IndexName: "im_Index",
        KeyConditionExpression: "#im = :im",
        ExpressionAttributeNames: {
            "#im": "im"
        },
        ExpressionAttributeValues: {
            ":im": Im
        }
    };
    table.query(params).promise().then((value) => {
        console.log("find succeeded.");
        return res.send(value)
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.post('/notepad/update', (req, res) => { //更新表中的内容（不清除原本存在的），并创建更新日期
    console.dir(req.body);
    let Name = req.body.name
    let Date = req.body.date
    let Detail = req.body.detail.split(",")
    let Uptime = parseInt(req.body.updatetime)
    let params = {
        TableName: "Notepad",
        Key: {
            "name": Name,
            "date": Date
        },
        UpdateExpression: "set #updatetime= :u,#detail = list_append(#detail,:d)",
        ExpressionAttributeNames: {
            "#detail": "detail",
            "#updatetime": "updatetime"
        },
        ExpressionAttributeValues: {
            ":d": Detail,
            ":u": Uptime
        },
        ReturnValus: "UPDATED_NEW"
    }
    table.update(params).promise().then((value) => {
        console.log("update succeeded.");
        return res.send("Succeeded")
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.post('/notepad/change_im', (req, res) => { //更新重要程度
    console.dir(req.body);
    let Name = req.body.name
    let Date = req.body.date
    let Im = parseInt(req.body.im)
    let params = {
        TableName: "Notepad",
        Key: {
            "name": Name,
            "date": Date
        },
        UpdateExpression: "set #im= :i",
        ExpressionAttributeNames: {
            "#im": "im"
        },
        ExpressionAttributeValues: {
            ":i": Im
        },
        ReturnValus: "UPDATED_NEW"
    }
    table.update(params).promise().then((value) => {
        console.log("change succeeded.");
        return res.send("Succeeded")
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

app.get('/notepad/im_paixu', (req, res) => { //根据重要程度由高到低排序并输出
    let params = {
        TableName: "Notepad",
        ProjectionExpression: "#name, #date, #detail, #im",
        ExpressionAttributeNames: {
            "#name": "name",
            "#date": "date",
            "#detail": "detail",
            "#im": "im"
        }
    };
    table.scan(params).promise().then((value) => {
        for (let i = 0; i < value.Count - 1; i++) {
            let min = value.Items[i];
            for (let j = i + 1; j < value.Count; j++) {
                if (min.im < value.Items[j].im) {
                    let temp = min;
                    min = value.Items[j];
                    value.Items[j] = temp;
                }
            }
            value.Items[i] = min;
        }
        return res.send(value)
    })
        .catch((err) => {
            console.error("Unable to query id. Error:", JSON.stringify(err, null, 2))
        });
})

module.exports = app;



