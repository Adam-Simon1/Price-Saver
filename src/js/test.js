// Starts after the html document is completely loaded and ready to go
document.addEventListener("DOMContentLoaded", function () {

  // Importing all the elements
  const inputField = document.getElementById("inputField");
  const textArea = document.getElementById("list-field");
  const returnButton = document.getElementById("button-input");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const priceH1 = document.getElementById("price-h1");
  const priceH1Child = priceH1.querySelector("span");
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=checkbox]"
  );
  const selectAll = document.getElementById("all");

  // Getting the value from selected checkboxes
  let enabledSettings = [];
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      enabledSettings = Array.from(checkboxes)
        .filter((i) => i.checked)
        .map((i) => i.value);

      console.log(enabledSettings);

      // Fetch data from selected CSV files
      fetchData(enabledSettings);
    });
  });

  // SelectAll button functionality
  selectAll.addEventListener("change", function () {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked;
    });

    if (this.checked) {
      enabledSettings = Array.from(checkboxes)
        .filter((checkbox) => checkbox !== this)
        .map((checkbox) => checkbox.value);
    } else {
      enabledSettings = [];
    }

    console.log(enabledSettings);

    // Fetch data from selected CSV files
    fetchData(enabledSettings);
  });

  // Getting data from .csv file based on checkboxes
  const csvFiles = ['results_tesco.csv', 'results_kaufland.csv'];

  // Fetch data from selected CSV files
  function fetchData(enabledSettings) {
    const selectedFiles = csvFiles.filter((file, index) =>
      enabledSettings.includes(String(index))
    );

    // Create an array of fetch promises
    const fetchPromises = selectedFiles.map(url => fetch(url).then(response => response.text()));

    // Use Promise.all() to fetch all the files concurrently
    Promise.all(fetchPromises)
      .then(dataArray => {
        const combinedData = dataArray.join('\n'); // Combine the CSV data from selected files
        const autocompleteData = parseCSVData(combinedData);

        // Showing autocomplete suggestions
        inputField.addEventListener("input", function (event) {
          const inputText = removeDiacritics(this.value);
          const suggestions = getAutocompleteSuggestions(
            inputText,
            autocompleteData
          );

          // Rendering the suggestions
          renderSuggestions(suggestions);
        });

        var totalPrice = 0;

        // After clicking on a suggestion, it is added to a text area, and the input is cleared
        suggestionsContainer.addEventListener("click", function (event) {
          if (event.target.classList.contains("autocomplete-suggestion")) {
            const selectedSuggestion = event.target.innerText;
            const currentText = textArea.value;

            if (currentText.includes(selectedSuggestion)) {
              return; // Skip adding duplicate suggestion
            }

            const newText = currentText
              ? currentText + "\n" + selectedSuggestion
              : selectedSuggestion;
            textArea.value = newText;
            suggestionsContainer.innerHTML = "";
            inputField.value = "";

            // Adding up price
            const newestText = textArea.value;
            const lines = newestText.split("\n");
            const lastItem = lines[lines.length - 1];
            const priceSplit = lastItem.split(";");
            const price = priceSplit[1];
            const modifiedPrice = price.replace(",", ".");
            const modifiedPriceInt = parseFloat(modifiedPrice, 10);
            totalPrice += modifiedPriceInt;
            totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
            Cookies.set("priceCookie", totalPrice, { expires: 1 });
            priceH1Child.textContent = "";
            priceH1Child.textContent = totalPrice + " €";
          }
        });

        // Price cookie, retrieves the last displayed price after refreshing
        const cookie = Cookies.get("priceCookie");
        const cookieInt = parseFloat(cookie, 10);
        if (cookieInt != 0) {
          priceH1Child.textContent = cookie + " €";
          totalPrice = cookieInt;
        }

        // A return button that removes the latest added product
        returnButton.addEventListener("click", function (event) {
          // Substracting price of a removed item
          const currentText = textArea.value;
          const lines = currentText.split("\n");
          const lastItem = lines[lines.length - 1];
          const priceSplit = lastItem.split(";");
          const price = priceSplit[1];
          const modifiedPrice = price.replace(",", ".");
          const modifiedPriceInt = parseFloat(modifiedPrice, 10);
          totalPrice -= modifiedPriceInt;
          totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
          priceH1Child.textContent = totalPrice + " €";
          Cookies.set("priceCookie", totalPrice, { expires: 1 });

          // Removes last product after pressing the return button
          lines.pop(); // Remove the last line
          textArea.value = lines.join("\n");
        });
      })
      .catch((error) => console.error("Error loading CSV files:", error));
  }

  // Parsing the data from .csv file, in order to be separated in rows
  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  // Function that filters the suggestions
  function getAutocompleteSuggestions(inputText, autocompleteData) {
    const inputWords = removeDiacritics(inputText.toLowerCase()).split(" ");
    const matchingSuggestions = autocompleteData.filter((suggestion) => {
      const suggestionWords = removeDiacritics(suggestion.toLowerCase()).split(
        " "
      );
      return inputWords.every((inputWord) =>
        suggestionWords.some((suggestionWord) =>
          suggestionWord.startsWith(inputWord)
        )
      );
    });
    return matchingSuggestions;
  }

  // Function used to render all the suggestions into the roll down window
  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = "";

    if (suggestions.length > 0) {
      suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("autocomplete-suggestion");
        suggestionElement.textContent = suggestion;
        suggestionsContainer.appendChild(suggestionElement);
      });
      suggestionsContainer.style.display = "block";
    } else {
      suggestionsContainer.style.display = "none";
    }
  }

  // Function to remove diacritics from a string
  function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
});
