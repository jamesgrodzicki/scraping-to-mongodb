const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
module.exports = app => {
    app.get('/', function (req, res) {
        axios.get('https://www.theguardian.com/us').then(response => {
            const $ = cheerio.load(response.data);
            console.log('scraped');
            const result = [];
            $('a.fc-item__link').each(function (i, element) {
                const data = {}
                data.title = $(this).children('span.fc-item__kicker').text();
                data.summary = $(this).children('span.fc-item__headline').text();
                data.link = $(this).attr('href');
                result.push(data);
            });
            console.log(result);
            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
            return res.render('index', { result: result });
        });
    });

    app.get('/articles/:id', function (req, res) {
        db.Article.findOne({ _id: req.params.id }).populate('comments')
            .then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            });
    });

    app.post('/articles/:id', function(req, res){
        db.Comment.create(req.body).then(function(dbComment){
            return db.Article.findOneAndUpdate(
                {_id:req.params.id},{comments:dbComment._id},{new:true});
        }).then(function(dbArticle){
            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });
}