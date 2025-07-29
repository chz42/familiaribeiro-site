
const firebaseConfig = {
  apiKey: "AIzaSyARk0YjJJUkCtPwK0GX2VykbZI0MfSK3OU",
  authDomain: "familia-ribeiro-f692a.firebaseapp.com",
  projectId: "familia-ribeiro-f692a",
  storageBucket: "familia-ribeiro-f692a.appspot.com",
  messagingSenderId: "36243339331",
  appId: "1:36243339331:web:7a35ba08968469bd7ebcf6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Verifica usuário logado
firebase.auth().onAuthStateChanged(user => {
  if (!user || !["chriz.40ribeiro@gmail.com", "chrizribeiro.42@gmail.com"].includes(user.email)) {
    alert("Acesso restrito. Redirecionando...");
    window.location.href = "/";
  } else {
    carregarUsuariosPendentes();
    carregarAlbuns();
  }
});

// Lista usuários para aprovação
function carregarUsuariosPendentes() {
  const container = document.getElementById("usuariosPendentes");
  container.innerHTML = "<p>Buscando usuários...</p>";
  db.collection("usuarios").where("aprovado", "==", false).get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = "<p>Não há usuários aguardando aprovação.</p>";
        return;
      }
      let html = "<table><tr><th>Email</th><th>Ações</th></tr>";
      snapshot.forEach(doc => {
        const user = doc.data();
        html += `<tr>
          <td>${user.email}</td>
          <td>
            <button onclick="aprovarUsuario('${doc.id}')">Aprovar</button>
            <button onclick="rejeitarUsuario('${doc.id}')">Rejeitar</button>
          </td>
        </tr>`;
      });
      html += "</table>";
      container.innerHTML = html;
    });
}

function aprovarUsuario(id) {
  db.collection("usuarios").doc(id).update({ aprovado: true });
  alert("Usuário aprovado.");
  carregarUsuariosPendentes();
}
function rejeitarUsuario(id) {
  db.collection("usuarios").doc(id).delete();
  alert("Usuário removido.");
  carregarUsuariosPendentes();
}

// Criar novo álbum
document.getElementById("formAlbum").addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("tituloAlbum").value;
  const descricao = document.getElementById("descricaoAlbum").value;
  db.collection("albuns").add({ titulo, descricao, criadoEm: new Date() })
    .then(() => {
      alert("Álbum criado com sucesso!");
      carregarAlbuns();
      e.target.reset();
    });
});

// Listar álbuns
function carregarAlbuns() {
  const lista = document.getElementById("listaAlbuns");
  db.collection("albuns").orderBy("criadoEm", "desc").get()
    .then(snapshot => {
      let html = "<ul>";
      snapshot.forEach(doc => {
        const a = doc.data();
        html += `<li><strong>${a.titulo}</strong>: ${a.descricao}</li>`;
      });
      html += "</ul>";
      lista.innerHTML = html;
    });
}
