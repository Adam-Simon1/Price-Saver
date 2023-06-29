document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  let content = document.getElementById("dropdown-content");

  profileBtn.addEventListener("click", () => {
    console.log("pressed");
    content.style.display = "block";
  });

  document.addEventListener("click", (event) => {
    if (!profileBtn.contains(event.target)) {
      content.style.display = "none";
    }
  });

  content.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = '/';
    Cookies.remove('token');
  });
});
