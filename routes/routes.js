const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
module.exports = app => {
    app.get('/articles', (req, res) => {
        db.Article.find({}).then(foundDB => {
            const result = [];
            const valueArr = [];
            foundDB.forEach((j, e) => valueArr.push(j.summary));
            console.log(valueArr);
            axios.get('https://www.theguardian.com/us').then(response => {
                const $ = cheerio.load(response.data);
                $('div.most-popular__headline').each(function(i, element) {
                    const data = {}
                    data.summary = $(this).children('.fc-item__title').children('.fc-item__link').children('.fc-item__headline').children('.js-headline-text').text();
                    data.link = $(this).children('.fc-item__title').children('a.fc-item__link').attr('href');
                    if (!valueArr.includes(data.summary)) {
                        result.push(data);
                    }
                });
            }).then(() => {
                console.log(result);
                if(result.length){
                    db.Article.create(result).then(dbArticle => {
                        res.json(dbArticle);
                    }).catch(err => {
                        res.json(err);
                    });
                } else {
                    res.json(foundDB);
                }
            });
        }).catch(err => {
            res.json(err);
        });
    });

    app.get('/articles/:id', (req, res) => {
        db.Article.findOne({ _id: req.params.id }).populate('comments')
            .then(dbArticle => {
                res.json(dbArticle);
            }).catch(err => {
                res.json(err);
            });
    });

    app.post('/articles/:id', (req, res) => {
        db.Comment.create(req.body).then(dbComment => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
        }).then(dbArticle => {
            res.json(dbArticle);
        }).catch(err => {
            res.json(err);
        });
    });
}