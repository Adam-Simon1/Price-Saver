document.addEventListener("DOMContentLoaded", () => {
  fetch("/lists", { method: "POST" })
    .then((response) => response.text())
    .then((data) => {
      const tableCount = JSON.parse(data).tableCount;
      const insertColumn = JSON.parse(data).insertColumn;

      const div = document.getElementById("tables");
      const tableContainer = document.querySelectorAll(".table-container");

      const arrayCookie = Cookies.get("idCookie");
      let idArray;

      let indexCounter = 0;
      try {
        idArray = JSON.parse(arrayCookie);
      } catch (error) {
        idArray = [];
      }

      if (tableCount == 0) {
        const icon = document.getElementById("icon");
        const emptyDiv = document.createElement("div");
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("start-btn");
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.textContent = "Create your first shopping list";
        btnContainer.appendChild(btn);
        emptyDiv.classList.add("empty-div");
        const h1 = document.createElement("h1");
        h1.textContent = "You don't have any shopping lists saved, yet.";
        emptyDiv.appendChild(h1);
        emptyDiv.appendChild(btnContainer);
        div.appendChild(emptyDiv);

        btn.addEventListener("click", () => {
          window.location.href = "/search";
        });
      } else {
        for (let i = 1; i < tableCount + 1; i++) {
          const svgPath = `
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>`;

          const iconDiv = document.createElement("div");
          iconDiv.classList.add("icon-container");
          const h1Div = document.createElement("div");
          const h1 = document.createElement("h1");
          h1.classList.add("table-h1");
          iconDiv.innerHTML += svgPath;
          h1Div.classList.add("table-container");
          h1Div.setAttribute("id", idArray[indexCounter]);
          h1.textContent = `Table${i}`;
          h1Div.appendChild(h1);
          h1Div.appendChild(iconDiv);
          div.appendChild(h1Div);
          indexCounter++;

          iconDiv.addEventListener("click", () => {
            const confirmed = window.confirm(
              "Are you sure you want to remove this?"
            );

            if (confirmed) {
              const tableId = h1Div.getAttribute("id");
              const tableNumber = parseInt(tableId, 10);
              axios.post("/remove-table", { tableNumber: tableNumber });

              idArray = idArray.filter((item) => item !== tableNumber);
              Cookies.set("idCookie", JSON.stringify(idArray), {
                expires: 3650,
              });
            } else {
            }
          });

          h1.addEventListener("click", () => {
            const tableId = h1Div.getAttribute("id");
            const tableNumber = parseInt(tableId, 10);

            axios
              .post("/open-table", { tableNumber: tableNumber })
              .then((response) => {
                console.log("Data sent successfully");
              })
              .catch((err) => {});

            const startTime = performance.now();
            fetch("/send-array", { method: "POST" })
              .then((response) => response.json())
              .then((data) => {
                const combinedArray = data.array;
                console.log(combinedArray);
                const jsonString = combinedArray.substring(
                  1,
                  combinedArray.length - 1
                );
                const obj = JSON.parse(jsonString);

                let itemArrayKauflandString;
                let itemArrayTescoString;
                let itemArrayTesco;
                let itemArrayKaufland;

                if (obj.includes(":")) {
                  itemArrayTescoString = obj.split(":")[0];
                  itemArrayKauflandString = obj.split(":")[1];
                  itemArrayTesco = JSON.parse(itemArrayTescoString);
                  itemArrayKaufland = JSON.parse(itemArrayKauflandString);
                } else if (obj.includes("t")) {
                  itemArrayTescoString = obj.replace("t", "");
                  itemArrayTesco = JSON.parse(itemArrayTescoString);
                } else if (obj.includes("k")) {
                  itemArrayKauflandString = obj.replace("k", "");
                  itemArrayKaufland = JSON.parse(itemArrayKauflandString);
                }

                const key1 = "kaufland";
                const key2 = "tesco";

                saveArrayLocally(itemArrayKaufland, key1, tableNumber);
                saveArrayLocally(itemArrayTesco, key2, tableNumber);

                function saveArrayLocally(array, key, tableNumber) {
                  localStorage.setItem(
                    `${key}_${tableNumber}`,
                    JSON.stringify(array)
                  );
                }

                window.location.href = `/saved-tables?tableNumber=${tableNumber}`;
                const endTime = performance.now();
                const totalTime = endTime - startTime;
                console.log(`Request duration: ${totalTime} milliseconds`);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
