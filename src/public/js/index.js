function openLink() {
  window.location.href = "/signin";
}

function openLink2() {
  window.location.href = "/signup";
}

function openLink3() {
  window.location.href = "/search";
}

function openLink4() {
  window.location.href = "/tables";
}

function openLink5() {
  window.location.href = "/shopping-lists";
}

function openLink6() {
  window.location.href = "https://github.com/Adam-Simon1/Price-Saver"
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";

  form.submit();
});
