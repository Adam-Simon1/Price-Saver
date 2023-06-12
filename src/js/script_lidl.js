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
    "https://www.lidl.sk/c/cerstve-maso-a-ryby/a10015797?channel=store&tabCode=Current_Sales_Week", {waitUntil:'load'}
  );
  
  // Page selection loop, runs 15 times because there is 15 elements that need to be clicked
  for (let i = 3; i < 15; i++) {
    products = [];
    const productsHandles = await page.$$(
      ".ACampaignGrid > .ACampaignGrid__item"
    );
    
    // Extracting all html components
    for (const producthandle of productsHandles) {
      let title = "Null";
      let price = "Null";

      try {
        title = await page.evaluate(
          (el) =>
            el.querySelector(
              "div > div > div > div.grid-box__content > h2"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) =>
            el.querySelector(
              "div > div > div > div.product-grid-box__price > div > div > div.m-price.m-price--special.m-price--right > div > div.m-price__main.m-price__main--labelled > div.m-price__bottom > div"
            ).textContent,
          producthandle
        );
      } catch (error) {}

      // Removing leading and trailing white spaces
      const trimmedTitle = title.trim();
      const trimmmedPrice = price.trim();
      
      // Appending all components inside .csv file and only those that aren't equal to "Null"
      if (title !== "Null") {
        products.push({title, price});
          /**fs.appendFile(
            "results_lidl.csv",
            `${title} ; ${price}\n`,
            function (err) {
              if (err) throw err;
            }
          );*/
        }
       console.log(title); 
      }
      

      // Perform page click after the loop is finished
      //await page.click(`#ATheHeroStage__Toggable79541461 > div > nav > div > div > div:nth-child(${i})`);
      await page.waitForNavigation();
    }
    
  
  // Closing browser
  await browser.close();

})();
