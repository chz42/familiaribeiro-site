
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARk0YjJJUkCtPwK0GX2VykbZI0MfSK3OU",
  authDomain: "familia-ribeiro-f692a.firebaseapp.com",
  projectId: "familia-ribeiro-f692a",
  storageBucket: "familia-ribeiro-f692a.appspot.com",
  messagingSenderId: "36243339331",
  appId: "1:36243339331:web:7a35ba08968469bd7ebcf6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("message").textContent = "Bem-vindo, " + user.email;
    })
    .catch((error) => {
      document.getElementById("message").textContent = "Erro ao entrar: " + error.message;
    });
});
