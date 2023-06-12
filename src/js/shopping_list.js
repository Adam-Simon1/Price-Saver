import { lastItem } from "./home.js";
document.addEventListener("DOMContentLoaded", function () {
  // Importing elements
  const textArea = document.getElementById("list-field");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const returnButton = document.getElementById("button-input");
  const tableButton = document.getElementById("tablebtn");

  // Item arrays
  let itemArrayTesco = [];
  let itemArrayKaufland = [];

  // Getting data from tesco .csv file
  const tesco = "../csv/results_tesco.csv";
  fetch(tesco)
    .then((response) => response.text())
    .then((data) => {
      // Parsing data
      const dataArray = parseCSVData(data);

      // After clicking a suggestion
      suggestionsContainer.addEventListener("click", function (event) {
        setTimeout(function () {
          // If a tesco .csv file includes last item its added to the itemArrayTesco array
          if (dataArray.includes(lastItem)) {
            itemArrayTesco.push(lastItem);

            // Setting a cookie from a stringified array
            Cookies.set("tescoCookie", itemArrayTesco.toString(), {
              expires: 1,
            });
          }
        }, 10);
      });

      // After clicking a return button
      returnButton.addEventListener("click", function (event) {
        // Last item is removed from the array
        itemArrayTesco.splice(itemArrayTesco.indexOf(lastItem, 1));

        // Updating the cookie
        Cookies.set("tescoCookie", itemArrayTesco, { expires: 1 });
      });

      // Reading the cookie
      const tescoCookie = Cookies.get("tescoCookie");

      // Pushing the data from the cookie to the array
      itemArrayTesco.push(tescoCookie);

      // Removing ',' from the string
      itemArrayTesco = itemArrayTesco[0].substring(1).split(",");
      itemArrayTesco = itemArrayTesco.map((item) => item.trim());

      // Joining separated prices
      let joinedArray = [];
      for (let i = 0; i < itemArrayTesco.length; i += 2) {
        if (itemArrayTesco[i + 1]) {
          const joinedString = itemArrayTesco[i] + "," + itemArrayTesco[i + 1];
          joinedArray.push(joinedString);
        } else {
          joinedArray.push(itemArrayTesco[i]);
        }
      }

      // Replacing itemArrayTesco with the modified array
      itemArrayTesco = joinedArray;
    })

    // If there is an error in fetching the file
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Getting data from kaufland .csv file
  const kaufland = "../csv/results_kaufland.csv";
  fetch(kaufland)
    .then((response) => response.text())
    .then((data) => {
      // Parsing data
      const dataArray = parseCSVData(data);

      // After clicking a suggestion
      suggestionsContainer.addEventListener("click", function (event) {
        setTimeout(function () {
          // If a kaufland .csv file includes last item its added to the itemArrayTesco array
          if (dataArray.includes(lastItem)) {
            itemArrayKaufland.push(lastItem);

            // Setting a cookie from a stringified
            Cookies.set("kauflandCookie", itemArrayKaufland.toString(), {
              expires: 1,
            });
          }
        }, 10);
      });

      // After clicking a return button
      returnButton.addEventListener("click", function (event) {
        // Last item is removed from the array
        itemArrayKaufland.splice(itemArrayKaufland.indexOf(lastItem, 1));

        // Updating the cookie
        Cookies.set("kauflandCookie", itemArrayKaufland.toString(), {
          expires: 1,
        });
      });

      // Reading the cookie
      const kauflandCookie = Cookies.get("kauflandCookie");

      // Pushing the data from the cookie to the array
      itemArrayKaufland.push(kauflandCookie);

      // Removing ',' from the string
      itemArrayKaufland = itemArrayKaufland[0].substring(1).split(",");
      itemArrayKaufland = itemArrayKaufland.map((item) => item.trim());

      // Joining separated prices
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

      // Replacing itemArrayKaufland with the modified array
      itemArrayKaufland = joinedArray;
    })

    // If there is an error in fetching the file
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Function to parse the data
  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  // Function for creating table for tesco products
  function tableTesco() {
    // Removes any duplicates inside the array
    itemArrayTesco = [...new Set(itemArrayTesco)];

    // Removes any empty strings from the array
    itemArrayTesco = itemArrayTesco.filter((element) => element !== "");

    // Check if the h1 element already exists
    const h1Div = document.getElementById("h1-tesco");
    let h1 = h1Div.querySelector("h1");

    // Create the h1 element only if it doesn't exist
    if (!h1) {
      h1 = document.createElement("h1");
      h1.classList.add("table-name");
      const h1Text = document.createTextNode("Kaufland");
      h1.appendChild(h1Text);
      h1Div.appendChild(h1);
    }

    // Creating table and tbody elements
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    // Creating table header
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Product header
    const productHeader = document.createElement("th");
    productHeader.classList.add("product_header");
    const productHeaderText = document.createTextNode("Product");
    productHeader.appendChild(productHeaderText);
    headerRow.appendChild(productHeader);

    // Price header
    const priceHeader = document.createElement("th");
    priceHeader.classList.add("price_header");
    const priceHeaderText = document.createTextNode("Price");
    priceHeader.appendChild(priceHeaderText);
    headerRow.appendChild(priceHeader);

    // Quantity header
    const quantityHeader = document.createElement("th");
    quantityHeader.classList.add("quantity_header");
    const quantityHeaderText = document.createTextNode("Quantity");
    quantityHeader.appendChild(quantityHeaderText);
    headerRow.appendChild(quantityHeader);

    // Total price
    const totalPriceHeader = document.createElement("th");
    totalPriceHeader.classList.add("total_price_header");
    const totalPriceHeaderText = document.createTextNode("Total Price");
    totalPriceHeader.appendChild(totalPriceHeaderText);
    headerRow.appendChild(totalPriceHeader);

    // Adding to the table
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    // Iterating over itemArrayTesco and creating table rows
    itemArrayTesco.forEach((item) => {
      // Spliting the array to name and price
      const [name, price] = item.split(" ; ");

      // Creating table row
      const tableRow = document.createElement("tr");

      // Cell for the name
      const nameCell = document.createElement("td");
      const nameText = document.createTextNode(name);
      nameCell.appendChild(nameText);
      tableRow.appendChild(nameCell);

      // Cell for the price
      const priceCell = document.createElement("td");
      priceCell.classList.add("price_cell");
      const priceText = document.createTextNode(price + " €");
      priceCell.appendChild(priceText);
      tableRow.appendChild(priceCell);

      // Cell for the quantity
      const quantityCell = document.createElement("td");
      quantityCell.classList.add("quantity-container");
      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity-input");

      // Properties and attributes of the input
      quantityCell.type = "text";
      quantityCell.name = "quantity";

      // Continuation
      quantityCell.appendChild(quantityInput);
      tableRow.appendChild(quantityCell);

      // Cell for total price
      const totalPriceCell = document.createElement("td");
      totalPriceCell.classList.add("total-price-cell");
      tableRow.appendChild(totalPriceCell);

      // Adding the whole row to the table
      tableBody.appendChild(tableRow);
    });

    // Adding the table body to the whole table
    table.appendChild(tableBody);

    // Append the table to a container element in the HTML
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = ""; // Clear previous content
    tableContainer.appendChild(table);
  }

  // Function for creating table for kaufland products
  function tableKaufland() {
    // Removes any duplicates inside the array
    itemArrayKaufland = [...new Set(itemArrayKaufland)];

    // Removes any empty strings from the array
    itemArrayKaufland = itemArrayKaufland.filter((element) => element !== "");

    // Check if the h1 element already exists
    const h1Div = document.getElementById("h1-kaufland");
    let h1 = h1Div.querySelector("h1");

    // Create the h1 element only if it doesn't exist
    if (!h1) {
      h1 = document.createElement("h1");
      h1.classList.add("table-name");
      const h1Text = document.createTextNode("Tesco");
      h1.appendChild(h1Text);
      h1Div.appendChild(h1);
    }

    // Creating table and tbody elements
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    // Creating table header
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Product header
    const productHeader = document.createElement("th");
    productHeader.classList.add("product_header");
    const productHeaderText = document.createTextNode("Product");
    productHeader.appendChild(productHeaderText);
    headerRow.appendChild(productHeader);

    // Price header
    const priceHeader = document.createElement("th");
    priceHeader.classList.add("price_header");
    const priceHeaderText = document.createTextNode("Price");
    priceHeader.appendChild(priceHeaderText);
    headerRow.appendChild(priceHeader);

    // Quantity header
    const quantityHeader = document.createElement("th");
    quantityHeader.classList.add("quantity_header");
    const quantityHeaderText = document.createTextNode("Quantity");
    quantityHeader.appendChild(quantityHeaderText);
    headerRow.appendChild(quantityHeader);

    // Total price
    const totalPriceHeader = document.createElement("th");
    totalPriceHeader.classList.add("total_price_header");
    const totalPriceHeaderText = document.createTextNode("Total Price");
    totalPriceHeader.appendChild(totalPriceHeaderText);
    headerRow.appendChild(totalPriceHeader);

    // Adding to the table
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    // Iterating over itemArrayTesco and creating table rows
    itemArrayKaufland.forEach((item) => {
      // Spliting the array to name and price
      const [name, price] = item.split(" ; ");

      // Creating table row
      const tableRow = document.createElement("tr");

      // Cell for the name
      const nameCell = document.createElement("td");
      const nameText = document.createTextNode(name);
      nameCell.appendChild(nameText);
      tableRow.appendChild(nameCell);

      // Cell for the price
      const priceCell = document.createElement("td");
      priceCell.classList.add("price_cell");
      const priceText = document.createTextNode(price + " €");
      priceCell.appendChild(priceText);
      tableRow.appendChild(priceCell);

      // Cell for the quantity
      const quantityCell = document.createElement("td");
      quantityCell.classList.add("quantity-container");
      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity-input");

      // Properties and attributes of the input
      quantityCell.type = "text";
      quantityCell.name = "quantity";

      // Continuation
      quantityCell.appendChild(quantityInput);
      tableRow.appendChild(quantityCell);

      // Cell for total price
      const totalPriceCell = document.createElement("td");
      totalPriceCell.classList.add("total-price-cell");
      tableRow.appendChild(totalPriceCell);

      // Adding the whole row to the table
      tableBody.appendChild(tableRow);
    });

    // Adding the table body to the whole table
    table.appendChild(tableBody);

    // Append the table to a container element in the HTML
    const tableContainer = document.getElementById("table-container2");
    tableContainer.innerHTML = ""; // Clear previous content
    tableContainer.appendChild(table);
  }

  let priceCellTotal;
  const totalPriceDiv = document.getElementById("total-price");
  let totalPriceH1 = totalPriceDiv.querySelector("h1");

  // Summing up the base prices
  function sumUpTablePrices() {
    const priceCell = document.querySelectorAll(".price_cell");
    const totalPriceCell = document.querySelectorAll(".total-price-cell");
    let priceCellNumber;
    let priceCellNumberArray = [];

    for (let i = 0; i < priceCell.length; i++) {
      priceCellNumber = parseFloat(
        priceCell[i].textContent.replace("€", "").replace(",", "."),
        10
      );

      priceCellNumberArray.push(priceCellNumber);
    }

    priceCellTotal = priceCellNumberArray.reduce((a, b) => a + b, 0);
    priceCellTotal = Math.round((priceCellTotal + Number.EPSILON) * 100) / 100;

    if (!totalPriceH1) {
      totalPriceH1 = document.createElement("h1");
      totalPriceDiv.appendChild(totalPriceH1);
    }

    totalPriceH1.textContent = "Final Price: " + priceCellTotal + ' €';
  }

  // Function to handle keyup event on input elements
  function handleInputKeyUp(event, inputIndex) {
    const priceCell = document.querySelectorAll(".price_cell");
    const totalPriceCell = document.querySelectorAll(".total-price-cell");
    // Check if the enter key was pressed
    if (event.key === "Enter") {
      const inputValue = parseFloat(event.target.value, 10);

      // Getting the correct number
      const priceCellNumber = parseFloat(
        priceCell[inputIndex].textContent.replace("€", "").replace(",", "."),
        10
      );

      // Multiplying the price by the quatity value
      let totalPrice = priceCellNumber * inputValue;
      totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
      totalPriceCell[inputIndex].textContent = totalPrice + " €";

      // Adding up all the prices to a final price
      let totalPriceNumberArray = [];
      for (let i = 0; i < totalPriceCell.length; i++) {
        const totalPriceValue = totalPriceCell[i].textContent
          .trim()
          .replace(",", ".")
          .replace("€", "");
        if (totalPriceValue !== "") {
          let totalPriceNumber = parseFloat(totalPriceValue);
          totalPriceNumber = (totalPriceNumber / inputValue) * (inputValue - 1);
          if (!isNaN(totalPriceNumber)) {
            totalPriceNumberArray.push(totalPriceNumber);
          }
        }
      }
      let totalPriceCellTotal = totalPriceNumberArray.reduce(
        (a, b) => a + b,
        0
      );
      let finalPrice = totalPriceCellTotal + priceCellTotal;
      finalPrice = Math.round((finalPrice + Number.EPSILON) * 100) / 100;

      // Check if h1 element already exists
      if (!totalPriceH1) {
        totalPriceH1 = document.createElement("h1");
        totalPriceDiv.appendChild(totalPriceH1);
      }

      // Update the content of the h1 element
      totalPriceH1.textContent = "Final Price: " + finalPrice + ' €';
    }
  }

  // Function to attach event listeners to quantity inputs
  function EventListenersToQuantityInputs() {
    const quantityInputs = document.getElementsByClassName("quantity-input");

    for (let i = 0; i < quantityInputs.length; i++) {
      const input = quantityInputs[i];
      input.addEventListener("keyup", function (event) {
        handleInputKeyUp(event, i); 
        this.value = this.value.replace(/[^0-9]/g, "");
      });
    }
  }

  tableButton.addEventListener("click", function () {
    if (textArea.value !== "") {
      if (itemArrayKaufland.length) {
        tableKaufland();
      }
      if (itemArrayTesco.length) {
        tableTesco();
      }
    }
    EventListenersToQuantityInputs();
    sumUpTablePrices();
  });
});
