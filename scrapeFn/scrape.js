//we need puppeter
const puppeteer = require("puppeteer");
//package fs to write a file
const fs = require("fs");
//to store the data
const data = {
  list: [],
};

//The main function
async function main(skill) {
  //1 . to open chromium browser
  //headless : False =  we want to see browser getting open and getting close
  //headless: true = means it all runs in background
  const browser = await puppeteer.launch({ headless: false });
  // 2. open a new tab in browser
  const page = await browser.newPage();
  // 3. now we have to go to indeed site:
  // http://in.indeed.com/jobs?q={skill}&l=Bengaluru%2C+Karnataka
  //pdf form

  await page.goto(
    `https://in.indeed.com/jobs?q=${skill}&l=Bengaluru%2C+Karnataka`,
    {
      timeout: 0,
      waitUntil: "networkidle0",
    }
  );
  //we have to put front end script
  const jobData = await page.evaluate(async (data) => {
    //it will give whole page html in data
    const items = document.querySelectorAll("td.resultContent");
    //getting data from that item
    items.forEach((item, index) => {
      const title = item.querySelector("h2.jobTitle>a")?.innerText;
      const link = item.querySelector("h2.jobTitle>a")?.href;
      const salary = item.querySelector(
        "div.metadata.salary-snippet-container>div"
      )?.innerText;
      const companyName = item.querySelector("span.companyName")?.innerText;

      if (salary === null) {
        salary = "not defined";
      }
      data.list.push({
        title,
        salary,
        companyName,
        link,
      });
    });
    // we return the data we scrapped
    return data;
  }, data);

  //we store the data we get from jobDAta scrapping in response
  let respone = await jobData;
  // then we stringyfy the response into JSON file
  let json = JSON.stringify(jobData, null, 2); //stringify(value, replacer ,  padding);
  //we used fs to write the data
  /**   fs.writefile will create a file and store the data u want to store .
        fs.writeFile(filename , fileType , metadata , callback);
   */
  fs.writeFile("job.json", json, "utf-8", () => {
    console.log("written in job.json");
  });
  // to cloase the browser
  browser.close();
  return respone;
}

module.exports = main;
