const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//Request targeting all articles

app.route("/articles").

get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully added the new article");
        }
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all the articles");
        } else {
            res.send(err);
        }
    });
});

//Request targeting a specific article

app.route("/articles/:articleTitle")
    // req.params.articleTitle = "jQuery"
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title are found");
            }
        })
    })
    .put(function(req, res) {
        Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content },
            function(err) {
                if (!err)
                    res.send("Successfully updated the content");
            })
    })
    .patch(function(req, res) {
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
            function(err) {
                if (!err)
                    res.send("Successfully updated the content");
            })
    })
    .delete(function(req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function(err) {
            if (!err) {
                res.send("Successfully deleted the article");
            } else {
                res.send(err);
            }
        })
    })

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});