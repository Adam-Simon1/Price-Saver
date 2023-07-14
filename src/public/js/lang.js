document.addEventListener("DOMContentLoaded", async () => {
  const en = await loadFiles("../lang/en.json");
  const sk = await loadFiles("../lang/sk.json");
  let value;
  const btn = document.querySelector(".langs");
  const langCookie = Cookies.get("langCookie");
  const langAttribute = Cookies.get("langAttribute");

  try {
    if (langCookie) {
      value = JSON.parse(langCookie);
      if (langAttribute == "sk") {
        btn.classList.add("sk");
      } else {
        btn.classList.remove("sk");
      }
    } else {
      value = en;
    }
  } catch (error) {
    if (langCookie) {
      value = JSON.parse(langCookie);
    } else {
      value = en;
    }
  }

  try {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("sk")) {
        btn.classList.remove("sk");
        Cookies.set("langAttribute", "en");
        value = en;
      } else {
        btn.classList.add("sk");
        Cookies.set("langAttribute", "sk");
        value = sk;
      }

      Cookies.set("langCookie", JSON.stringify(value), { expires: 30 });
      updateTextContent(value);
    });
  } catch (error) {}

  try {
    const btnMobile = document.querySelector(".langs-mobile");
    btnMobile.addEventListener("click", () => {
      if (btnMobile.classList.contains("sk")) {
        btnMobile.classList.remove("sk");
        Cookies.set("langAttribute", "en");
        value = en;
      } else {
        btnMobile.classList.add("sk");
        Cookies.set("langAttribute", "sk");
        value = sk;
      }

      Cookies.set("langCookie", JSON.stringify(value), { expires: 30 });
      updateTextContent(value);
    });
  } catch (error) {}

  updateTextContent(value);

  function loadFiles(array) {
    return fetch(array)
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
  }

  const svg = `<svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon-logout"
      width="27"
      height="27"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#000000"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
      />
      <path d="M9 12h12l-3 -3" />
      <path d="M18 15l3 -3" />
    </svg>`;

  function updateTextContent(value) {
    try {
      // Home page
      document.getElementById("list-btn").textContent = value.lists;
      document.getElementById("profile-btn").textContent = value.profile;
      document.querySelector(".link_github").textContent = value.gitHub;
      document.querySelector(".dropdown-list").innerHTML = svg + value.signOut;
      document.querySelector(".welcome").textContent = value.welcome;
      document.querySelector(".price-savvy").textContent = value.priceSavvy;
      document.getElementById("startbtn").textContent = value.start;
      document.getElementById("search").textContent = value.searchPreview;
      document.getElementById("search-desc").textContent =
        value.searchPreviewDesc;
      document.getElementById("create").textContent = value.listsPreview;
      document.getElementById("create-desc").textContent =
        value.listsPreviewDesc;
      document.getElementById("saved-title").textContent =
        value.savedListsPreview;
      document.getElementById("saved-desc").textContent =
        value.savedListsPreviewDesc;
    } catch (error) {}

    try {
      // Search page
      document
        .getElementById("inputField")
        .setAttribute("placeholder", value.searchPlaceHolder);
      document.getElementById("label-all").textContent = value.all;
      document.getElementById("apply-changes").textContent = value.changes;
      document.getElementById("button-input");
      document.getElementById("dropbtn").textContent = value.dropDown;
      document.querySelector("[data-value='lowest-highest']").textContent =
        value.dropDownDataLH;
      document.querySelector("[data-value='highest-lowest']").textContent =
        value.dropDownDataHL;
      document.querySelector("[data-value='a-z']").textContent =
        value.dropDownDataAZ;
      document.querySelector("[data-value='z-a']").textContent =
        value.dropDownDataZA;
      document.getElementById("finished").textContent = value.finished;
      document.getElementById("finished-desc").textContent = value.finishedDesc;
      document.getElementById("next-page").textContent = value.nextPage;
    } catch (error) {}

    try {
      // Tables
      document.getElementById("tablebtn").textContent = value.createTable;
      document.getElementById("savebtn").textContent = value.save;
    } catch (error) {}

    try {
      // Shopping lists
      document.querySelector(".title-text").textContent =
        value.shoppingListsTitle;
    } catch (error) {}

    try {
      // Start page
      document.getElementById("btn2").textContent = value.signIn;
      document.querySelector(".link_github").textContent = value.gitHub;
      document.querySelector(".h2-container>h2").textContent =
        value.startPageDesc;
      document.getElementById("search").textContent = value.searchPreview;
      document.getElementById("search-desc").textContent =
        value.searchPreviewDesc;
      document.getElementById("create").textContent = value.listsPreview;
      document.getElementById("create-desc").textContent =
        value.listsPreviewDesc;
      document.getElementById("saved-title").textContent =
        value.savedListsPreview;
      document.getElementById("saved-desc").textContent =
        value.savedListsPreviewDesc;
    } catch (error) {}

    try {
      // Sign in
      document.querySelector(".link_github").textContent = value.gitHub;
      document.querySelector(".signin").textContent = value.signIn;
      document.querySelector(".title-signin").textContent = value.signIn;
      document.querySelector(".githubbtn").innerHTML =
        `<img src="../assets/github.png" alt="" />` + value.signInWith;
      document.getElementById("email").setAttribute("placeholder", value.email);
      document
        .getElementById("password")
        .setAttribute("placeholder", value.password);
      document.querySelector(".or").textContent = value.or;
      document.querySelector(".signup").textContent = value.dontHaveAccount;
    } catch (error) {}

    try {
      // Sign up
      document.querySelector(".link_github").textContent = value.gitHub;
      document.getElementById("signupbtn").textContent = value.signUp;
      document.querySelector(".title-container>h1").textContent = value.signUp;
      document.getElementById("name").setAttribute("placeholder", value.name);
      document.getElementById("email").setAttribute("placeholder", value.email);
      document
        .getElementById("password")
        .setAttribute("placeholder", value.password);
      document.querySelector(".signin-link").textContent = value.haveAccount;
    } catch (error) {}

    try {
      // Home page mobile support
      document.getElementById("gh-link").textContent = value.gitHub;
      document.getElementById("listbtn").textContent = value.lists;
      document.getElementById("sign-out").style.content = svg + value.signOut;
    } catch (error) {}
  }
});
