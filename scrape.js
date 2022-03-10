import Scraper from "images-scraper";
import express from "express";
const app = express();
const port = 3000;

app.use("/", express.static("public"));

app.get("/scrape", async (req, res) => {
  console.log("req", req.query.searchTerm);
  scrape(req.query.searchTerm).then((url) => {
    console.log(url);
    res.send(url);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//scraper
const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

const scrape = async (searchTerm) => {
  const results = await google.scrape(searchTerm, 50);
  return results[Math.floor(Math.random() * results.length)].url;
};
