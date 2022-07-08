const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({title: String,
                    content: String});
const Article = mongoose.model("Article", articleSchema);

/////////////request targeting a specific articles///////////
app.route("/articles/:articleTitle")
.get(function(req,res){
Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
if(foundArticle){
  res.send(foundArticle);
}
else{
  res.send("No articles matching that title was found.");
}
});
})
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    function(err){
      if(!err){
        res.send("Succesfully updated article");
      }
    }
  );
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
// update a field dynamicly, depends what field the user provided (title/content)
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully updated article");
      }else{
        res.send(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      Article.findOneAndRemove({_id: foundArticle.id} ,function(err){
        if(!err){
          res.send("Article deleted Succesfully");
        }else{
          res.send(err);
        }
      });
    }
  });
});

/////////////request targeting all articles///////////
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfuly added item");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("all articles deleted");
    }else{
      res.send(err);
    }
  });
});

const firstArticle = new Article({
  title: "wiki test",
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat o"
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
