//jshint esversion

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { json } = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});
const articleSchema ={
    title:String,
    content:String
};
const Article = mongoose.model("article",articleSchema);

app.get("/articles",function(req,res){
    Article.find(function(err,result){
        if(!err){
            console.log(result);
        }else{
            console.log(err);
        }
    });
});

// app.get("/articles/delete",function(req,res){
//     Article.delete();
// });
 
//  app.get("/articles/shivam/delete",function(req,res){
//      Article.deleteMany({title:'shivam'});
//  });

app.route("/articles")
.get(function(req,res){
    
    Article.find(function(err){
        if(err){
            res.send(err);
        }else{
        res.send("Item deleted successfully");
        }
    });
 })
 .post(function(req,res){

    const newArticle = new Article({
        title=req.body.title,
        content=req.body.content
    });
       newArticle.save(); 
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err)
        console.log("Successfully deleted the item");
        else
        console.log(err);
    });
});

app.route("/articles/:name")
 
.get(function(req,res){
 const heading = req.params.name;
 Article.findOne({name = heading},function(err,foundarticle){
     if(!err)
     res.send(foundarticle);
     else
     res.send(err);
 });
 

})
.put(function(req,res){
    Article.update({name:heading},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
        if(!err)
        res.send("Successfully updated");
        else
        res.send(err);
        })
})
.patch(function(req,res){
    const heading = req.params.name;
    Article.update({title:heading},
        {$set:req.body},
        function(err,result){
            if(!err)
            res.send(result);
            else
            res.send(err);
        });
})
.delete(function(req,res){
    Article.deleteOne({title:req.body.params},function(err){
        if(!err)
        res.send("Successfully deleted the item");
        else
        res.send(err);
    });
}).post();

app.listen(3000,function(){
    console.log("Server is running");
});