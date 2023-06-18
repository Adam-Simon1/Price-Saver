import { lastItem } from "./home.js";


document.addEventListener("DOMContentLoaded", function () {
    
  let itemArrayTesco = [];
  let itemArrayKaufland = [];  
  const textArea = document.getElementById("list-field");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const returnButton = document.getElementById("button-input");
  const nextPage = document.getElementById("next-page");

  const tesco = "results_tesco.csv";
  fetch(tesco)
    .then((response) => response.text())
    .then((data) => {
      const dataArray = parseCSVData(data);

      suggestionsContainer.addEventListener("click", function (event) {
        setTimeout(function () {
          if (dataArray.includes(lastItem)) {
            itemArrayTesco.push(lastItem);

            Cookies.set("tescoCookie", itemArrayTesco.toString(), {
              expires: 1,
            });
          }
        }, 100);
      });

      returnButton.addEventListener("click", function (event) {
        itemArrayTesco.splice(itemArrayTesco.indexOf(lastItem, 1));

        Cookies.set("tescoCookie", itemArrayTesco, { expires: 1 });
      });

      const tescoCookie = Cookies.get("tescoCookie");
      itemArrayTesco.push(tescoCookie);

      itemArrayTesco = itemArrayTesco[0].substring(1).split(",");
      itemArrayTesco = itemArrayTesco.map((item) => item.trim());

      let joinedArray = [];
      for (let i = 0; i < itemArrayTesco.length; i += 2) {
        if (itemArrayTesco[i + 1]) {
          const joinedString = itemArrayTesco[i] + "," + itemArrayTesco[i + 1];
          joinedArray.push(joinedString);
        } else {
          joinedArray.push(itemArrayTesco[i]);
        }
      }

      itemArrayTesco = joinedArray;
      console.log(itemArrayTesco);
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const kaufland = "results_kaufland.csv";
  fetch(kaufland)
    .then((response) => response.text())
    .then((data) => {
      const dataArray = parseCSVData(data);

      suggestionsContainer.addEventListener("click", function (event) {
        setTimeout(function () {
          if (dataArray.includes(lastItem)) {
            itemArrayKaufland.push(lastItem);

            Cookies.set("kauflandCookie", itemArrayKaufland.toString(), {
              expires: 1,
            });
          }
        }, 100);
      });

      returnButton.addEventListener("click", function (event) {
        itemArrayKaufland.splice(itemArrayKaufland.indexOf(lastItem, 1));

        Cookies.set("kauflandCookie", itemArrayKaufland.toString(), {
          expires: 1,
        });
      });

      const kauflandCookie = Cookies.get("kauflandCookie");

      itemArrayKaufland.push(kauflandCookie);

      itemArrayKaufland = itemArrayKaufland[0].substring(1).split(",");
      itemArrayKaufland = itemArrayKaufland.map((item) => item.trim());

      let joinedArray = [];
      for (let i = 0; i < itemArrayKaufland.length; i += 2) {
        if (itemArrayKaufland[i + 1]) {
          const joinedString =
            itemArrayKaufland[i] + "," + itemArrayKaufland[i + 1];
          joinedArray.push(joinedString);
        } else {
          joinedArray.push(itemArrayKaufland[i]);
        }
      }

      itemArrayKaufland = joinedArray;
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  nextPage.addEventListener('click', () => {
    saveArrayLocally(itemArrayKaufland, key1);
    saveArrayLocally(itemArrayTesco, key2);
  })

  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  function saveArrayLocally(array, key) {
    localStorage.setItem(key, JSON.stringify(array));
  }

  const key1 = "kaufland";
  const key2 = 'tesco'
});
