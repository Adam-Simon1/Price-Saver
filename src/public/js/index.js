const listBtn = document.getElementById("list-btn");
const signOut = document.getElementById("sign-out");
const github = document.getElementById("gh-link");
const startBtn = document.getElementById("startbtn");
const menu = document.getElementById("menu");
const menuBtn = document.querySelector(".menu-btn");
const menuList = document.getElementById("menu-list");

listBtn.addEventListener("click", () => {
  console.log("pressed");
  window.location.href = "/shopping-lists";
  axios.post("/lists", {});
});

signOut.addEventListener("click", async (event) => {
  try {
    await fetch("/remove-token", { method: "POST" });
    console.log("Cookie removed successfully");
    window.location.href = "/";
  } catch (error) {
    console.log("Error removing cookie:", error);
  }
});

github.addEventListener("click", () => {
  window.location.href = "https://github.com/Adam-Simon1/Price-Saver";
});

startBtn.addEventListener("click", () => {
  window.location.href = "/search";
});

let menuOpen = false;
menuBtn.addEventListener("click", () => {
  if (!menuOpen) {
    menuBtn.classList.add("open");
    menuOpen = true;
  } else {
    menuBtn.classList.remove("open");
    menuOpen = false;
  }

  if (menu.classList === "show") {
    menu.classList.toggle("");
  } else {
    menu.classList.toggle("show");
  }

  if (menu.classList !== "show") {
    menuList.style.display = "none";
  }
});

menu.addEventListener("transitionend", (event) => {
  if (event.propertyName === "height") {
    if (menu.classList.contains("show")) {
      menuList.style.display = "flex";
    }
  }
});
