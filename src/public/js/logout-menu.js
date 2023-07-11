document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  const content = document.querySelector(".dropdown-content");
  const dropdownList = document.querySelector(".dropdown-list");

  profileBtn.addEventListener("click", () => {
    console.log("pressed");
    content.classList.toggle("show");

    if (content.classList !== "show") {
      dropdownList.style.display = "none";
    }
  });

  content.addEventListener("transitionend", (event) => {
    if (event.propertyName === "height") {
      if (content.classList.contains("show")) {
        dropdownList.style.display = "flex";
      }
    }
  });

  content.addEventListener("click", () => {
    console.log("Clicked");
    const sendOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    fetch("/remove-cookie", sendOptions)
      .then((response) => {
        console.log(response);
        window.location.href = "/";
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });
});
