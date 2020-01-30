/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb").MongoClient;
const rp = require("request-promise-native");

const dbName = "stockchecker";
const colName = "likes";

module.exports = function(app) {
  app.route("/api/stock-prices").get(async (req, res) => {
    // 2 stocks
    if (Array.isArray(req.query.stock)) {
      if (req.query.stock.length === 2) {
        const stock1 = req.query.stock[0].toUpperCase();
        const stock2 = req.query.stock[1].toUpperCase();
        const like = req.query.like == "true";

        // Begin stock API requests
        const stock1Request = rp(
          `https://repeated-alpaca.glitch.me/v1/stock/${stock1}/quote`
        );
        const stock2Request = rp(
          `https://repeated-alpaca.glitch.me/v1/stock/${stock2}/quote`
        );

        // Connect to DB for like request
        const client = new MongoClient(process.env.DB, {
          useUnifiedTopology: true
        });
        try {
          await client.connect();
          const col = client.db(dbName).collection(colName);

          // Begin like data requests, add IP if necessary
          const likeRequest1 = col.findOneAndUpdate(
            { stock: stock1 },
            like
              ? { $addToSet: { likeIpList: req.connection.remoteAddress } }
              : { $set: { stock: stock1 } },
            { upsert: true, returnOriginal: false }
          );
          const likeRequest2 = col.findOneAndUpdate(
            { stock: stock2 },
            like
              ? { $addToSet: { likeIpList: req.connection.remoteAddress } }
              : { $set: { stock: stock2 } },
            { upsert: true, returnOriginal: false }
          );

          // Compose response
          const stock1Price = JSON.parse(await stock1Request).latestPrice;
          const stock2Price = JSON.parse(await stock2Request).latestPrice;
          const likeResult1 = await likeRequest1;
          const likeResult2 = await likeRequest2;
          const stock1Likes = likeResult1.value.likeIpList
            ? likeResult1.value.likeIpList.length
            : 0;
          const stock2Likes = likeResult2.value.likeIpList
            ? likeResult2.value.likeIpList.length
            : 0;
          res.json({
            stockData: [
              {
                stock: stock1,
                price: stock1Price.toString(),
                rel_likes: stock1Likes - stock2Likes
              },
              {
                stock: stock2,
                price: stock2Price.toString(),
                rel_likes: stock2Likes - stock1Likes
              }
            ]
          });
        } catch (e) {
          console.log(e);
          res.send("Database or stock API error");
        }

        client.close();
      }

      // Too many stocks
      else {
        res.send("Maximum is 2 stocks");
      }
    }

    // 1 stock
    else {
      const stock = req.query.stock.toUpperCase();
      const like = req.query.like == "true";

      // Begin stock API request
      const stockRequest = rp(
        `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`
      );

      // Connect to DB for like request
      const client = new MongoClient(process.env.DB, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        const col = client.db(dbName).collection(colName);

        // Request like data, add IP if necessary
        const likeResult = await col.findOneAndUpdate(
          { stock: stock },
          like
            ? { $addToSet: { likeIpList: req.connection.remoteAddress } }
            : { $set: { stock: stock } },
          { upsert: true, returnOriginal: false }
        );

        // Compose response
        const stockPrice = JSON.parse(await stockRequest).latestPrice;
        const stockLikes = likeResult.value.likeIpList
          ? likeResult.value.likeIpList.length
          : 0;
        res.json({
          stockData: {
            stock: stock,
            price: stockPrice.toString(),
            likes: stockLikes
          }
        });
      } catch (e) {
        console.log(e);
        res.send("Database or stock API error");
      }

      client.close();
    }
  });
};
