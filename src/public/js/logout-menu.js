document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  const content = document.querySelector(".dropdown-content");
  const dropdownList = document.querySelector(".dropdown-list");
  const accountbtn = document.getElementById("account");

  profileBtn.addEventListener("click", () => {
    console.log("pressed");
    content.classList.toggle("show");

    if (content.classList !== "show") {
      dropdownList.style.display = "none";
      accountbtn.style.display = "none";
    }
  });

  content.addEventListener("transitionend", (e) => {
    if (e.propertyName === "height") {
      if (content.classList.contains("show")) {
        dropdownList.style.display = "flex";
        accountbtn.style.display = "flex";
      }
    }
  });

  content.addEventListener('click', (e) => {
    e.preventDefault();
  })

  dropdownList.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Clicked");
    const sendOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/remove-cookie", sendOptions)
      .then((response) => {
        window.location.href = "/";
      })

      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });
});
