import { lastItem } from "./home.js";
document.addEventListener("DOMContentLoaded", function () {
  const textArea = document.getElementById("list-field");
  const suggestionsContainer = document.querySelector(
    ".autocomplete-suggestions"
  );
  const returnButton = document.getElementById("button-input");
  const tableButton = document.getElementById("tablebtn");

  let itemArrayTesco = [];
  let itemArrayKaufland = [];

  const tesco = "../csv/results_tesco.csv";
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
        }, 10);
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
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  const kaufland = "../csv/results_kaufland.csv";
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
        }, 10);
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

  function parseCSVData(csvData) {
    const rows = csvData.split("\n");
    return rows.map((row) => row.trim());
  }

  function tableTesco() {
    itemArrayTesco = [...new Set(itemArrayTesco)];

    itemArrayTesco = itemArrayTesco.filter((element) => element !== "");

    const h1Div = document.getElementById("h1-tesco");
    let h1 = h1Div.querySelector("h1");

    if (!h1) {
      h1 = document.createElement("h1");
      h1.classList.add("table-name");
      const h1Text = document.createTextNode("Kaufland");
      h1.appendChild(h1Text);
      h1Div.appendChild(h1);
    }

    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const productHeader = document.createElement("th");
    productHeader.classList.add("product_header");
    const productHeaderText = document.createTextNode("Product");
    productHeader.appendChild(productHeaderText);
    headerRow.appendChild(productHeader);

    const priceHeader = document.createElement("th");
    priceHeader.classList.add("price_header");
    const priceHeaderText = document.createTextNode("Price");
    priceHeader.appendChild(priceHeaderText);
    headerRow.appendChild(priceHeader);

    const quantityHeader = document.createElement("th");
    quantityHeader.classList.add("quantity_header");
    const quantityHeaderText = document.createTextNode("Quantity");
    quantityHeader.appendChild(quantityHeaderText);
    headerRow.appendChild(quantityHeader);

    const totalPriceHeader = document.createElement("th");
    totalPriceHeader.classList.add("total_price_header");
    const totalPriceHeaderText = document.createTextNode("Total Price");
    totalPriceHeader.appendChild(totalPriceHeaderText);
    headerRow.appendChild(totalPriceHeader);

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    itemArrayTesco.forEach((item) => {
      const [name, price] = item.split(" ; ");

      const tableRow = document.createElement("tr");

      const nameCell = document.createElement("td");
      const nameText = document.createTextNode(name);
      nameCell.appendChild(nameText);
      tableRow.appendChild(nameCell);

      const priceCell = document.createElement("td");
      priceCell.classList.add("price_cell");
      const priceText = document.createTextNode(price + " €");
      priceCell.appendChild(priceText);
      tableRow.appendChild(priceCell);

      const quantityCell = document.createElement("td");
      quantityCell.classList.add("quantity-container");
      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity-input");

      quantityCell.type = "text";
      quantityCell.name = "quantity";

      quantityCell.appendChild(quantityInput);
      tableRow.appendChild(quantityCell);

      const totalPriceCell = document.createElement("td");
      totalPriceCell.classList.add("total-price-cell");
      tableRow.appendChild(totalPriceCell);

      tableBody.appendChild(tableRow);
    });

    table.appendChild(tableBody);

    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }

  function tableKaufland() {
    itemArrayKaufland = [...new Set(itemArrayKaufland)];

    itemArrayKaufland = itemArrayKaufland.filter((element) => element !== "");

    const h1Div = document.getElementById("h1-kaufland");
    let h1 = h1Div.querySelector("h1");

    if (!h1) {
      h1 = document.createElement("h1");
      h1.classList.add("table-name");
      const h1Text = document.createTextNode("Tesco");
      h1.appendChild(h1Text);
      h1Div.appendChild(h1);
    }

    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const productHeader = document.createElement("th");
    productHeader.classList.add("product_header");
    const productHeaderText = document.createTextNode("Product");
    productHeader.appendChild(productHeaderText);
    headerRow.appendChild(productHeader);

    const priceHeader = document.createElement("th");
    priceHeader.classList.add("price_header");
    const priceHeaderText = document.createTextNode("Price");
    priceHeader.appendChild(priceHeaderText);
    headerRow.appendChild(priceHeader);

    const quantityHeader = document.createElement("th");
    quantityHeader.classList.add("quantity_header");
    const quantityHeaderText = document.createTextNode("Quantity");
    quantityHeader.appendChild(quantityHeaderText);
    headerRow.appendChild(quantityHeader);

    const totalPriceHeader = document.createElement("th");
    totalPriceHeader.classList.add("total_price_header");
    const totalPriceHeaderText = document.createTextNode("Total Price");
    totalPriceHeader.appendChild(totalPriceHeaderText);
    headerRow.appendChild(totalPriceHeader);

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    itemArrayKaufland.forEach((item) => {
      const [name, price] = item.split(" ; ");

      const tableRow = document.createElement("tr");

      const nameCell = document.createElement("td");
      const nameText = document.createTextNode(name);
      nameCell.appendChild(nameText);
      tableRow.appendChild(nameCell);

      const priceCell = document.createElement("td");
      priceCell.classList.add("price_cell");
      const priceText = document.createTextNode(price + " €");
      priceCell.appendChild(priceText);
      tableRow.appendChild(priceCell);

      const quantityCell = document.createElement("td");
      quantityCell.classList.add("quantity-container");
      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity-input");

      quantityCell.type = "text";
      quantityCell.name = "quantity";

      quantityCell.appendChild(quantityInput);
      tableRow.appendChild(quantityCell);

      const totalPriceCell = document.createElement("td");
      totalPriceCell.classList.add("total-price-cell");
      tableRow.appendChild(totalPriceCell);

      tableBody.appendChild(tableRow);
    });

    table.appendChild(tableBody);

    const tableContainer = document.getElementById("table-container2");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }

  let priceCellTotal;
  const totalPriceDiv = document.getElementById("total-price");
  let totalPriceH1 = totalPriceDiv.querySelector("h1");

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

    totalPriceH1.textContent = "Final Price: " + priceCellTotal + " €";
  }

  function handleInputKeyUp(event, inputIndex) {
    const priceCell = document.querySelectorAll(".price_cell");
    const totalPriceCell = document.querySelectorAll(".total-price-cell");

    if (event.key === "Enter") {
      const inputValue = parseFloat(event.target.value, 10);

      const priceCellNumber = parseFloat(
        priceCell[inputIndex].textContent.replace("€", "").replace(",", "."),
        10
      );

      let totalPrice = priceCellNumber * inputValue;
      totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
      totalPriceCell[inputIndex].textContent = totalPrice + " €";

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

      if (!totalPriceH1) {
        totalPriceH1 = document.createElement("h1");
        totalPriceDiv.appendChild(totalPriceH1);
      }

      totalPriceH1.textContent = "Final Price: " + finalPrice + " €";
    }
  }

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
