// Importing modules
const puppeteer = require("puppeteer");
const fs = require("fs");

fs.writeFileSync("src\\csv\\results_tesco.csv", "", (err) => {
  if (err) {
    console.log(err);
  }
});

const appTesco = (async () => {

  // Browser setup
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  const baseUrl = "https://tesco.sk/akciove-ponuky/akciove-produkty/";
  await page.goto(baseUrl);

  // Extracting number of pages from website
  let pageNumber = 1;
  const lastPage = await page.evaluate(() => {
      const element = document.querySelector(
        "span:nth-child(10) > div > a > span > span"
      );
      return element ? element.textContent : null;
    });
    const lastPageNumber = parseInt(lastPage, 10);

  // Pagination cycle
  while (true) {

    // Changing pages
    const url = `${baseUrl}?page=${pageNumber}`;
    await page.goto(url);
    
    // Extracting products from pages and appending them to .csv file
    const productsHandles = await page.$$(
      ".product-container.m-productListing__productsGrid.desktop.hidden.visible-md > div"
    );
    await page.waitForSelector(
      "div > a > div > div.product__info-wrapper > span"
    );
    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";

      try {
        title = await page.evaluate(
          (el) =>
            el.querySelector("div > a > div > div.product__info-wrapper > span")
              .textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(
              "div > a > div > div.product__info-wrapper > div.product__secondary-text > span.product__price-cc-text"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      if (title !== "Null") {
        fs.appendFile(
          "src\\csv\\results_tesco.csv",
          `${title} ; ${price}\n`,
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    // Increasing number of pages
    pageNumber++;

    // Breaking while loop if reaches final page
    if (pageNumber == lastPageNumber + 1) {
      break;
    }
  }

  // Closing website
  await browser.close();
})();

module.exports = appTesco;