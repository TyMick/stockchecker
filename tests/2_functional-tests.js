/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    let firstLikeTotal;

    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.strictEqual(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.isOk(res.body.stockData.price);
          assert.property(res.body.stockData, "likes");
          assert.isNumber(res.body.stockData.likes);
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: "true" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.strictEqual(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.isOk(res.body.stockData.price);
          assert.property(res.body.stockData, "likes");
          assert.isAbove(res.body.stockData.likes, 0);
          firstLikeTotal = res.body.stockData.likes;
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: "true" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.strictEqual(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.isOk(res.body.stockData.price);
          assert.property(res.body.stockData, "likes");
          assert.strictEqual(res.body.stockData.likes, firstLikeTotal);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData);
          assert.strictEqual(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], "stock");
          assert.strictEqual(res.body.stockData[0].stock, "GOOG");
          assert.property(res.body.stockData[0], "price");
          assert.isOk(res.body.stockData[0].price);
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "stock");
          assert.strictEqual(res.body.stockData[1].stock, "MSFT");
          assert.property(res.body.stockData[1], "price");
          assert.isOk(res.body.stockData[1].price);
          assert.property(res.body.stockData[1], "rel_likes");
          assert.strictEqual(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData);
          assert.strictEqual(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], "stock");
          assert.strictEqual(res.body.stockData[0].stock, "GOOG");
          assert.property(res.body.stockData[0], "price");
          assert.isOk(res.body.stockData[0].price);
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "stock");
          assert.strictEqual(res.body.stockData[1].stock, "MSFT");
          assert.property(res.body.stockData[1], "price");
          assert.isOk(res.body.stockData[1].price);
          assert.property(res.body.stockData[1], "rel_likes");
          assert.strictEqual(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          done();
        });
    });
  });
});
