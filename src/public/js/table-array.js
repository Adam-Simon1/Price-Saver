document.addEventListener("DOMContentLoaded", () => {
  const textArea = document.getElementById("list-field");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const returnButton = document.getElementById("button-input");
  const nextPage = document.getElementById("next-page");

  const cookieValue = Cookies.get("textareaCookie");
  if (cookieValue !== undefined) {
    const textareaValue = Cookies.get("textareaCookie");
    const textareaValueModified = textareaValue.split("\n").join("\n");
    textArea.value = textareaValueModified;
  }

  const tesco = "results_tesco.csv";
  fetch(tesco)
    .then((response) => response.text())
    .then((data) => {
      const dataArray = parseCSVData(data);

      suggestionsContainer.addEventListener("click", () => {
        setTimeout(function () {
          appendArray("tesco", dataArray);
          textAreaCookie();
        }, 100);
      });

      returnButton.addEventListener("click", () => {
        removeArray("tesco");

        setTimeout(() => {
          textAreaCookie();
        }, 100);
      });
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
          appendArray("kaufland", dataArray);
          textAreaCookie();
        }, 100);
      });

      returnButton.addEventListener("click", function (event) {
        removeArray("kaufland");

        setTimeout(() => {
          textAreaCookie();
        }, 100);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  nextPage.addEventListener("click", () => {
    textAreaCookie();
  });

  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  function appendArray(key, refrenceData) {
    const newestText = textArea.value;
    const lines = newestText.split("\n");
    const lastItem = lines[lines.length - 1];

    let storage = JSON.parse(localStorage.getItem(key));
    if (storage == null) {
      storage = [];
    }

    if (refrenceData.includes(lastItem)) {
      storage.push(lastItem);
      localStorage.setItem(key, JSON.stringify(storage));
    }
  }

  function removeArray(key) {
    const newestText = textArea.value;
    const lines = newestText.split("\n");
    const lastItem = lines[lines.length - 1];

    let storage = JSON.parse(localStorage.getItem(key));
    if (storage == null) {
      storage = [];
    }

    storage.splice(storage.indexOf(lastItem, 1));
    localStorage.setItem(key, JSON.stringify(storage));
  }

  function textAreaCookie() {
    const textareaValue = textArea.value;
    Cookies.set("textareaCookie", textareaValue, {
      expires: 1,
    });
  }
});
