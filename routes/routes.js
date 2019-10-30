const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');
module.exports = app => {
    app.get('/', function(req, res){
        axios.get('https://www.theguardian.com/us').then(response => {
            const $ = cheerio.load(response.data);
            console.log('scraped');
            const result = [];
            $('a.fc-item__link').each(function(i, element){
                const data = {}
                data.title = $(this).children('span.fc-item__kicker').text();
                data.summary = $(this).children('span.fc-item__headline').text();
                data.link = $(this).attr('href');
                result.push(data);
            });
            console.log(result);
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err)
            });
            res.render('index', {result: result});
        });
    });
}