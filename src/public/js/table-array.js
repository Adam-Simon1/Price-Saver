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

  let tescoArray;
  let kauflandArray;

  const sendOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  };

  suggestionsContainer.addEventListener("click", () => {
    fetch("/autocomplete-data", sendOptions)
      .then((response) => response.json())
      .then((data) => {
        tescoArray = JSON.parse(data.tescoArray);
        kauflandArray = JSON.parse(data.kauflandArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setTimeout(function () {
      appendArray("tesco", tescoArray);
      appendArray("kaufland", kauflandArray);
      textAreaCookie();
    }, 100);
  });

  returnButton.addEventListener("click", () => {
    removeArray("tesco");
    removeArray("kaufland");
    setTimeout(() => {
      textAreaCookie();
    }, 100);
  });
  
  nextPage.addEventListener("click", () => {
    textAreaCookie();
  });

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
