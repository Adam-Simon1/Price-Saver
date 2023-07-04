document.addEventListener("DOMContentLoaded", function () {
  function retrieveArrayLocally(key) {
    const storedArray = localStorage.getItem(key);
    return JSON.parse(storedArray);
  }

  const key1 = "kaufland";
  const key2 = "tesco";
  let itemArrayKaufland = retrieveArrayLocally(key1);
  let itemArrayTesco = retrieveArrayLocally(key2);

  const tableButton = document.getElementById("tablebtn");
  const saveButton = document.getElementById("savebtn");

  saveButton.addEventListener("click", () => {
    fetch("/table-count", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        const tableCount = JSON.parse(data.tableCount).length;
        console.log(tableCount);
        const div = document.getElementById("saved-container");

        if (tableCount < 20) {
          const text = document.createElement("p");
          text.classList.add("saved");
          text.textContent = "Shopping list saved successfully";
          div.appendChild(text);
        } else {
          const text = document.createElement("p");
          text.classList.add("saved");
          text.textContent =
            "The limit of shopping lists is 20. If you want to procced, please remove a shopping list that you don't need.";
          div.appendChild(text);
        }
      });

    axios
      .post("/table/data", {
        arrayDataTesco: itemArrayTesco,
        arrayDataKaufland: itemArrayKaufland,
      })
      .then((response) => {})
      .catch((err) => {
        console.log("Error sending data:", err);
      });
  });

  function createTable(array, tableName, tableNameDivId, tableDivId) {
    array = [...new Set(array)];

    array = array.filter((element) => element !== "");

    const h1Div = document.getElementById(tableNameDivId);
    let h1 = h1Div.querySelector("h1");

    if (!h1) {
      h1 = document.createElement("h1");
      h1.classList.add("table-name");
      const h1Text = document.createTextNode(tableName);
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

    array.forEach((item) => {
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
      quantityInput.id = "q-input";

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

    const tableContainer = document.getElementById(tableDivId);
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
    console.log(itemArrayKaufland, itemArrayTesco);

    if (itemArrayKaufland.length > 0 || itemArrayKaufland !== null) {
      createTable(
        itemArrayKaufland,
        "Kaufland",
        "h1-kaufland",
        "table-container"
      );
    }
    if (itemArrayTesco.length > 0 || itemArrayKaufland !== null) {
      createTable(itemArrayTesco, "Tesco", "h1-tesco", "table-container2");
    }

    EventListenersToQuantityInputs();
    sumUpTablePrices();
  });
});
