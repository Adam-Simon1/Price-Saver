document.addEventListener("DOMContentLoaded", () => {
  
  const urlParams = new URLSearchParams(window.location.search);
  const tableNumber = urlParams.get("tableNumber");

  let itemArrayKaufland = JSON.parse(
    localStorage.getItem(`kaufland_${tableNumber}`)
  );
  let itemArrayTesco = JSON.parse(
    localStorage.getItem(`tesco_${tableNumber}`)
  );

  const tableButton = document.getElementById("tablebtn");

  function tableTesco() {
    itemArrayTesco = [...new Set(itemArrayTesco)];

    itemArrayTesco = itemArrayTesco.filter((element) => element !== "");

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
    console.log(itemArrayKaufland, itemArrayTesco);

    if (itemArrayKaufland.length > 0) {
      tableKaufland();
    }
    if (itemArrayTesco.length > 0) {
      tableTesco();
    }

    EventListenersToQuantityInputs();
    sumUpTablePrices();
  });
});
