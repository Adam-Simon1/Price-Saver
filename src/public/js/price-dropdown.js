document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("dropbtn");
  let content = document.getElementById("dropdown-content");
  const contentsA = document.querySelectorAll(".dropdown-content a");

  profileBtn.addEventListener("click", () => {
    content.style.display = "block";
  });

  contentsA.forEach((contentA) => {
    contentA.addEventListener("click", () => {
        const selectedValue = contentA.textContent;
        console.log(selectedValue);
        profileBtn.textContent = selectedValue;
        content.style.display = "none";
    });
  });

  document.addEventListener("click", (event) => {
    if (!profileBtn.contains(event.target)) {
      content.style.display = "none";
    }
  });
});
