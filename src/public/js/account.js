document.addEventListener("DOMContentLoaded", () => {
  const account = document.getElementById("account");
  const accountMobile = document.getElementById("account-mobile");
  const sendOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch("/account-name", sendOptions)
    .then((response) => response.json())
    .then((data) => {
      const username = data.username;

      account.textContent = username;
      accountMobile.textContent = username;
    });
});
