// Importing modules
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  // Browser setup
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();
  await page.goto(
    "https://predajne.kaufland.sk/aktualna-ponuka/aktualny-tyzden/akciove-vyrobky.category=01_M%C3%A4so__hydina__%C3%BAdeniny.html"
  );
  
  // Page selection loop, runs 15 times because there is 15 elements that need to be clicked
  for (let i = 2; i < 15; i++) {
    products = [];
    const productsHandles = await page.$$(
      ".g-row.g-layout-overview-tiles.g-layout-overview-tiles--offers > div"
    );
    
    // Extracting all html components
    for (const producthandle of productsHandles) {
      let title1 = "Null";
      let title2 = "Null";
      let price = "Null";

      try {
        title1 = await page.evaluate(
          (el) =>
            el.querySelector(
              "div > div > a > div.m-offer-tile__container > div.m-offer-tile__text > h5"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      try {
        title2 = await page.evaluate(
          (el) =>
            el.querySelector(
              "div > div > a > div.m-offer-tile__container > div.m-offer-tile__text > h4"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(
              " div > div > a > div.m-offer-tile__split > div.m-offer-tile__price-tiles > div > div.a-pricetag__price-container > div.a-pricetag__price"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      // Removing leading and trailing white spaces
      const trimmedTitle2 = title2.trim();
      const trimmmedPrice = price.trim();
      
      // Appending all components inside .csv file and only those that aren't equal to "Null"
      if (title1 !== "Null") {
        if (title2 !== "Null") {
          finalTitle = title1 + " " + trimmedTitle2;
          fs.appendFile(
            "src\\csv\\results_kaufland.csv",
            `${finalTitle} ; ${trimmmedPrice}\n`,
            function (err) {
              if (err) throw err;
            }
          );
        } else {
          fs.appendFile(
            "src\\csv\\results_kaufland.csv",
            `${title1} ; ${trimmmedPrice}\n`,
            function (err) {
              if (err) throw err;
            }
          );
        }
      }
    }
    
    // Perform page click after the loop is finished
    await page.click(`#offers-overview-1 > ul > li:nth-child(${i})`);
    await page.waitForNavigation();
  }

  // Closing browser
  await browser.close();
})();
