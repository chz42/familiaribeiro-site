// admin.js

// 1. Configuração do Firebase
// Lembre-se de substituir com as suas credenciais!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 2. Verificação de Autenticação e Permissão de Administrador
// Esta função é executada toda vez que o estado de autenticação muda.
auth.onAuthStateChanged(user => {
    if (!user) {
        // Se não houver usuário logado, redireciona para a página inicial
        alert("Acesso restrito. Faça o login.");
        window.location.href = "/";
        return;
    }

    // Emails de administradores. Você pode adicionar mais se precisar.
    const adminEmails = ["chriz.40ribeiro@gmail.com", "chrizribeiro.42@gmail.com"];

    // Verifica se o email do usuário logado está na lista de admins
    if (!adminEmails.includes(user.email)) {
        alert("Você não tem permissão de administrador. Redirecionando.");
        window.location.href = "/";
        return;
    }

    // Se o usuário é um admin, carrega as funcionalidades
    carregarUsuariosPendentes();
    carregarAlbuns();
});

// 3. Funções para Gerenciamento de Usuários
function carregarUsuariosPendentes() {
    const listaUsuariosPendentes = document.getElementById('usuarios-pendentes-lista');
    listaUsuariosPendentes.innerHTML = ''; // Limpa a lista para evitar duplicatas

    db.collection("usuarios")
        .where("aprovado", "==", false)
        .onSnapshot(querySnapshot => {
            listaUsuariosPendentes.innerHTML = ''; // Limpa a lista novamente
            if (querySnapshot.empty) {
                listaUsuariosPendentes.innerHTML = '<p>Nenhum usuário pendente para aprovação.</p>';
                return;
            }
            querySnapshot.forEach(doc => {
                const usuario = doc.data();
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${usuario.email}</span>
                    <button onclick="aprovarUsuario('${doc.id}')">Aprovar</button>
                    <button onclick="rejeitarUsuario('${doc.id}')">Rejeitar</button>
                `;
                listaUsuariosPendentes.appendChild(li);
            });
        });
}

function aprovarUsuario(uid) {
    db.collection("usuarios").doc(uid).update({
        aprovado: true
    })
    .then(() => {
        alert("Usuário aprovado com sucesso!");
    })
    .catch(error => {
        alert("Erro ao aprovar usuário: " + error.message);
    });
}

function rejeitarUsuario(uid) {
    db.collection("usuarios").doc(uid).delete()
    .then(() => {
        alert("Usuário rejeitado e removido com sucesso!");
    })
    .catch(error => {
        alert("Erro ao rejeitar usuário: " + error.message);
    });
}

// 4. Funções para Gerenciamento de Álbuns
function carregarAlbuns() {
    const listaAlbuns = document.getElementById('albuns-lista');
    listaAlbuns.innerHTML = ''; // Limpa a lista

    db.collection("albuns").onSnapshot(querySnapshot => {
        listaAlbuns.innerHTML = ''; // Limpa a lista novamente
        if (querySnapshot.empty) {
            listaAlbuns.innerHTML = '<p>Nenhum álbum cadastrado.</p>';
            return;
        }
        querySnapshot.forEach(doc => {
            const album = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${album.nome}</span>
                <button onclick="excluirAlbum('${doc.id}')">Excluir</button>
            `;
            listaAlbuns.appendChild(li);
        });
    });
}

function criarAlbum() {
    const nomeAlbum = prompt("Digite o nome do novo álbum:");
    if (nomeAlbum) {
        db.collection("albuns").add({
            nome: nomeAlbum,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert(`Álbum '${nomeAlbum}' criado com sucesso!`);
        })
        .catch(error => {
            alert("Erro ao criar álbum: " + error.message);
        });
    }
}

function excluirAlbum(id) {
    if (confirm("Tem certeza que deseja excluir este álbum?")) {
        db.collection("albuns").doc(id).delete()
        .then(() => {
            alert("Álbum excluído com sucesso!");
        })
        .catch(error => {
            alert("Erro ao excluir álbum: " + error.message);
        });
    }
}

// 5. Função de Logout
function logout() {
    auth.signOut()
    .then(() => {
        window.location.href = "/";
    })
    .catch(error => {
        alert("Erro ao fazer logout: " + error.message);
    });
}
