//in memory database
let accounts = [
  { id: 1, username: "huy", password: "1234", hobbies: "sleep" },
  { id: 2, username: "huy2", password: "1234", hobbies: "sleep" },
  { id: 3, username: "huy3", password: "1234", hobbies: "sleep" },
];
//implement logic
const authenticationState = {
  isLoggedIn: false,
  profile: {},
};

const loginOrRegister = (username, password, hobbies) => {
  if (!username || !password) return;
  const inDb = accounts.find((account) => account.username === username);
  if (!inDb) {
    if (!hobbies) {
      alert("Please enter hobbies");
      return;
    }
    //register account
    register(username, password, hobbies);
    return;
  }
  if (inDb.password !== password) {
    alert("wrong password");
    return;
  }
  authenticationState.isLoggedIn = true;
  authenticationState.profile = inDb;
};

const register = (username, password, hobbies) => {
  const newAccount = addAccount(username, password, hobbies);
  if (!newAccount) return;
  authenticationState.isLoggedIn = true;
  authenticationState.profile = newAccount;
};
const addAccount = (username, password, hobbies) => {
  if (!username || !password || !hobbies) return null;
  const inDb = accounts.find((account) => account.username === username);
  if (inDb) {
    alert("username exist");
    return null;
  }
  const newAccount = { id: new Date().getTime(), username, password, hobbies };
  accounts.push(newAccount);
  return newAccount;
};
const logout = () => {
  authenticationState.isLoggedIn = false;
  authenticationState.profile = {};
};

const removeUser = (id) => {
  accounts = accounts.filter((account) => account.id !== id);
};
//static html elements
const page = document.querySelector("#page");
const loginContainer = document.querySelector("#loginContainer");
const loginPassword = document.querySelector("#loginPassword");
const loginUsername = document.querySelector("#loginUsername");
const loginHobbies = document.querySelector("#loginHobbies");
const btnLogin = document.querySelector("#btnLogin");
const logoutBtn = document.querySelector("#btnLogout");
const loginForm = document.querySelector("#loginForm");
const tbody = document.querySelector("tbody");
const loggedUsername = document.querySelector("#loggedUsername");

const registerForm = document.querySelector("#registerForm");
const registerUsername = document.querySelector("#registerUsername");
const registerPassword = document.querySelector("#registerPassword");
const registerHobbies = document.querySelector("#registerHobbies");
const btnRegister = document.querySelector("#btnRegister");
const registerModal = document.querySelector("#registerModal");
const removeBtn = document.querySelector("#removeBtn");
//event listeners
loginForm.addEventListener("submit", (e) => handleLogin(e));
btnLogin.addEventListener("click", (e) => handleLogin(e));
logoutBtn.addEventListener("click", (e) => handleLogout(e));
btnRegister.addEventListener("click", (e) => handleRegister(e));
//registerForm.addEventListener("click", (e) => handleRegister(e));

const handleRegister = (e) => {
  e.preventDefault();
  const username = registerUsername.value;
  const password = registerPassword.value;
  const hobbies = registerHobbies.value;
  if (!username || !password || !hobbies) {
    alert("Please enter a username and password and hobbies");
    return;
  }
  addAccount(username, password, hobbies);
  render();
};
const handleLogin = (e) => {
  e.preventDefault();
  const username = loginUsername.value;
  const password = loginPassword.value;
  const hobbies = loginHobbies.value;
  if (!username || !password) {
    alert("Please enter a username and password");
    return;
  }
  loginOrRegister(username, password, hobbies);
  //re render
  $("#registerModal").hide();
  render();
};

const handleLogout = () => {
  logout();
  render();
};
//render view
const render = () => {
  if (authenticationState.isLoggedIn) {
    page.style.display = "block";
    loginContainer.style.display = "none";
  } else {
    page.style.display = "none";
    loginContainer.style.display = "block";
  }
  loggedUsername.textContent =
    authenticationState.profile.username || "not logged in";
  //load table data
  tbody.innerHTML = "";
  accounts.forEach(({ id, username, email, password, hobbies }) => {
    tbody.innerHTML += `
        <tr>
        <th scope="row">${id}</th>
        <td>${username}</td>
        <td>${password}</td>
        <td>${hobbies}</td>
        <td><input type="checkbox" value="${id}" name="select"/></td>
      </tr>
        `;
  });
};

//initial render

render();

//remove user

removeBtn.addEventListener("click", () => {
  const listCheckbox = document.querySelectorAll("input[name='select']");
  const listChecked = [];
  for (let i = 0; i < listCheckbox.length; i++) {
    if (listCheckbox[i].checked) listChecked.push(listCheckbox[i]);
  }
  if(!listChecked.length) alert("Please select")
  listChecked.forEach((item) => {
      //only remove other user
    if(parseInt(item.value) !== authenticationState.profile.id) {
        removeUser(parseInt(item.value));
    }
  });
  render();
});
