const express = require("express");
const routes = express.Router();
const main = require("../scrapeFn/scrape");

//POST route
routes.post("/indeed", async (req, res) => {
  //when ever we use async n wait we use try and catch
  try {
    const { skill } = req.body;
    let scrp = await main(skill); // all scraping thing will be in main function

    return res.status(200).json({
      status: "ok",
      list: scrp?.list || {}, // ? = is used to say if scrp is null then dot operator does not work
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = routes;
