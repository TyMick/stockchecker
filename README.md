# Stock price checker microservice

I created this microservice as a requirement for [my freeCodeCamp Information Security and Quality Assurance Certification](https://www.freecodecamp.org/certification/tywmick/information-security-and-quality-assurance), using [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [MongoDB](https://mongodb.github.io/node-mongodb-native/), [Request](https://github.com/request/request), [Chai](https://www.chaijs.com/), and [Helmet](https://helmetjs.github.io/). The front end API tests on the home page also use [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/), and [highlight.js](https://highlightjs.org/).

You can read the functional tests I wrote on [GitHub](https://github.com/tywmick/stockchecker/tree/glitch/tests/2_functional-tests.js) or [Glitch](https://glitch.com/edit/#!/ty-stockchecker?path=tests/2_functional-tests.js). To run the tests yourself, create a MongoDB database, fork/remix this project, create a `.env` file with `DB="{your MongoDB connection string}"` and `NODE_ENV="test"`, start the server, and look at the server console logs.

This project fulfills the following user stories:

1.  Set the content security policies to only allow loading of scripts and css from your server.
2.  I can **GET** `/api/stock-prices` with form data containing a Nasdaq `stock` ticker and recieve back an object `stockData`.
3.  In `stockData`, I can see the `stock` (string, the ticker), `price` (decimal in string format), and `likes` (int).
4.  I can also pass along field `like` as `true` (boolean) to have my like added to the stock(s). Only 1 like per IP should be accepted.
5.  If I pass along 2 stocks, the return object will be an array with both stocks' info, but instead of `likes`, it will display `rel_likes` (the difference between the likes on both) on both.
6.  A good way to receive current price is the following external API (replacing 'GOOG' with your stock): `https://finance.google.com/finance/info?q=NASDAQ%3aGOOG`
7.  All 5 functional tests are complete and passing.
