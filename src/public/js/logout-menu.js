document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  const content = document.querySelector(".dropdown-content");
  const dropdownList = document.querySelector(".dropdown-list");

  profileBtn.addEventListener("click", () => {
    console.log("pressed");
    content.classList.toggle('show');

    if (content.classList !== "show") {
      dropdownList.style.display = "none";
    }
  });

  content.addEventListener('transitionend', (event) => {
    if(event.propertyName === "height"){
      if (content.classList.contains("show")) {
        dropdownList.style.display = "flex";
      }
    }
  })

  content.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = '/';
    Cookies.remove('token');
  });
});
