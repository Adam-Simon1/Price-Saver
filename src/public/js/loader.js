const loader = document.getElementById("preloader");
const page = document.querySelector(".body");
window.addEventListener("load", () => {
  loader.style.display = "none";

  page.classList.toggle("finished");
});
