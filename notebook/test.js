const chai=require('chai');
const asset=require('assert');
const should=chai.should();
const chaiHttp=require('chai-http');
const Joi=require('joi');
const server=require('./crud');
const expect=chai.expect;
const supertest=require('supertest');
const api=supertest('http://localhost:3000');
chai.use(chaiHttp);
chai.use(require('chai-json-schema'));

let recItemJsonSchema={
    title:'find note',
    description:'the format of note responsed',
    default:'Default value',
    required:['title','date','time','content'],
    type:'object',
    properties:{
        title:{ype:'string'},
        date:{type:'string'},
        time:{type:'string'},
        content:{type:'string'}
    }
}

let recListJsonSchema={
    title:'recListJsonSchema',
    description:'the format of the list scaned',
    default:'Default value',
    type:'array',
    item:{
        type:'object'
    }
}

let goodAdd={
    "title":"test01",
    "content":"I am added"
};
let badAdd={
    "title":"test02"
};
let goodUpdate={
    "title":"test01",
    "date":"2018-9-13",
    "content":"I am a good update"
};
let badUpdate={
    "title":"test02"
};
let goodDelete={
    "title":"xixi",
    "date":"2018-9-13"
};
let badDelete={
    "title":"xixi2"
};
let goodFindnoteByDate={
    "date":"2018-8-12"
};
let goodFindnote={
    "date":"2018-9-12",
    "title":"emm"
};
let badFind={
    "title":"emm"
};
let response={};


describe('test the basic page',function(){
    it('main page',function(done){
        api.get('/')
        .set('Accept','application/json')
        .expect(302,done);
    });

    it('/add note',function(done){
        api.get('/addnote')
        .set('Accept','application/json')
        .expect(200)
        .end(function(err,res){
            expect(res.body).to.not.equal(null);
            done();
        });
    });

    it('get list of notes',function(done){
        api.get('/allnotes')
        .set('Accept','application/json')
        .end(function(err,res){
            expect(res.body).to.be.jsonSchema(recListJsonSchema);
            for(let object_ of res.body){
                expect(object_).to.be.jsonSchema(recItemJsonSchema);
            }
            done();
        });
    });

    it('add a new note',function(done){
        api.post('/addnote')
        .set('Accept','application/json')
        .send({
            "title":"test01",
            "content":"somewhere only we know"
        })
        .expect(200)
        .end(function(err,res){
            expect(res.body).to.be();
            done();
        })
    })

    it('try to add a bad note',function(done){
        api.post('/addnote')
        .set('Accept','application/json')
        .send(badAdd)
        .expect(400)
        .end(function(err,res){
            expect(res.body).to.be.equal(response);
            done();
        })
    })

    it('to delete an item',function(done){
        api.post('/deletenote')
        .set('Accept','application/json')
        .send({
            "title":"test01",
            "date":"2018-9-13"
        })
        .expect(200)
        .end(function(err,res){
            expect(res.body.title).to.equal("test01");
            expect(res.body.date).to.equal("2018-9-13");
            expect(res.body).to.be.equal(recItemJsonSchema);
            done();
        })
    })

    it('update a note',function(done){
        api.post('/updatenote')
        .set('Accept','application/json')
        .send({
            "title":"tet01",
            "date":"2018-9-13",
            "content":"I am updated",
        })
        .end(function(err,res){
            expect(res.body.content).to.be.equal('I am updated');
            expect(res.body).to.be.jsonSchema(recItemJsonSchema);
            done();
        });
    });

    it('find a note by date',function(done){
        api.post('/findnote/date')
        .set('Accept','application/json')
        .send({
            "date":"2018-9-13"
        })
        .expect(200)
        .end(function(err,res){
            expect(res.body).to.be.jsonSchema(recListJsonSchema);
            for(let object_ of res.body){
                expect(object_).to.be.jsonSchema(recItemJsonSchema);
            }
            done();
        });
    });

});