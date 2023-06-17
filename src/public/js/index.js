function openLink() {
  window.location.href = "/signin";
}

function openLink2() {
  window.location.href = "/signup";
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  form.submit();
});
