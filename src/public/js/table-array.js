document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("list-field");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const returnButton = document.getElementById("button-input");
  const nextPage = document.getElementById("next-page");

  const cookieValue = Cookies.get("textareaCookie");
  if (cookieValue !== undefined) {
    const textareaValue = Cookies.get("textareaCookie");
    console.log(textareaValue);
    const textareaValueModified = textareaValue.split("\n").join("\n");
    textArea.value = textareaValueModified;
  }

  let itemArrayTesco = [];
  let itemArrayKaufland = [];

  const tesco = "results_tesco.csv";
  fetch(tesco)
    .then((response) => response.text())
    .then((data) => {
      const dataArray = parseCSVData(data);

      suggestionsContainer.addEventListener("click", function (event) {
        const newestText = textArea.value;
        const lines = newestText.split("\n");
        const lastItem = lines[lines.length - 1];
        setTimeout(function () {
          if (dataArray.includes(lastItem)) {
            const textareaValueC = textArea.value;
            Cookies.set("textareaCookie", textareaValueC, {
              expires: 1,
            });

            itemArrayTesco.push(lastItem);

            Cookies.set("tescoCookie", JSON.stringify(itemArrayTesco), {
              expires: 1,
            });
          }
        }, 100);
      });

      returnButton.addEventListener("click", function (event) {
        const newestText = textArea.value;
        const lines = newestText.split("\n");
        const lastItem = lines[lines.length - 1];
        itemArrayTesco.splice(itemArrayTesco.indexOf(lastItem, 1));

        setTimeout(() => {
          const textareaValueC = textArea.value;
          Cookies.set("textareaCookie", textareaValueC, {
            expires: 1,
          });
        }, 100);

        Cookies.set("tescoCookie", JSON.stringify(itemArrayTesco), {
          expires: 1,
        });
      });

      const tescoCookieString = Cookies.get("tescoCookie");
      const tescoCookie = JSON.parse(tescoCookieString);
      console.log(tescoCookie);
      itemArrayTesco = tescoCookie;

      itemArrayTesco = itemArrayTesco.filter((element) => element !== "");
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
        const newestText = textArea.value;
        const lines = newestText.split("\n");
        const lastItem = lines[lines.length - 1];

        setTimeout(function () {
          if (dataArray.includes(lastItem)) {
            const textareaValueC = textArea.value;
            Cookies.set("textareaCookie", textareaValueC, {
              expires: 1,
            });
            itemArrayKaufland.push(lastItem);

            Cookies.set("kauflandCookie", JSON.stringify(itemArrayKaufland), {
              expires: 1,
            });
          }
        }, 100);
      });

      returnButton.addEventListener("click", function (event) {
        const newestText = textArea.value;
        const lines = newestText.split("\n");
        const lastItem = lines[lines.length - 1];

        itemArrayKaufland.splice(itemArrayKaufland.indexOf(lastItem, 1));

        setTimeout(() => {
          const textareaValueC = textArea.value;
          Cookies.set("textareaCookie", textareaValueC, {
            expires: 1,
          });
        }, 100);

        Cookies.set("kauflandCookie", JSON.stringify(itemArrayKaufland), {
          expires: 1,
        });
      });

      const kauflandCookieString = Cookies.get("kauflandCookie");
      const kauflandCookie = JSON.parse(kauflandCookieString);

      itemArrayKaufland = kauflandCookie;

      itemArrayKaufland = itemArrayKaufland.filter((element) => element !== "");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  nextPage.addEventListener("click", () => {
    saveArrayLocally(itemArrayKaufland, key1);
    saveArrayLocally(itemArrayTesco, key2);

    const textareaValueC = textArea.value;
    Cookies.set("textareaCookie", textareaValueC, {
      expires: 1,
    });
  });

  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  function saveArrayLocally(array, key) {
    localStorage.setItem(key, JSON.stringify(array));
  }

  const key1 = "kaufland";
  const key2 = "tesco";
});
