
const firebaseConfig = {
  apiKey: "AIzaSyARk0YjJJUkCtPwK0GX2VykbZI0MfSK3OU",
  authDomain: "familia-ribeiro-f692a.firebaseapp.com",
  projectId: "familia-ribeiro-f692a",
  storageBucket: "familia-ribeiro-f692a.appspot.com",
  messagingSenderId: "36243339331",
  appId: "1:36243339331:web:7a35ba08968469bd7ebcf6"
};

firebase.initializeApp(firebaseConfig);

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (email === "chriz.40ribeiro@gmail.com" || email === "chrizribeiro.42@gmail.com") {
        window.location.href = "/admin.html";
      } else {
        alert("Login realizado com sucesso!");
      }
    })
    .catch((error) => {
      alert("Erro: " + error.message);
    });
}

function criarConta() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Conta criada! Aguarde aprovação do administrador.");
    })
    .catch((error) => {
      alert("Erro: " + error.message);
    });
}
