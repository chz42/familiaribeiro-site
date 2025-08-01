// app.js

// Importante: Substitua com as credenciais do seu projeto Firebase
const firebaseConfig = {
  // Substitua 'YOUR_API_KEY' pela sua Chave de API do Firebase
  apiKey: "AIzaSyARk0YjJJUkCtPwK0GX2VykbZI0MfSK3OU", 
  // Substitua 'YOUR_PROJECT_ID.firebaseapp.com' pelo seu domínio de autenticação
  authDomain: "familia-ribeiro-f692a.firebaseapp.com",
  // Substitua 'YOUR_PROJECT_ID' pelo seu ID de projeto
  projectId: "familia-ribeiro-f692a",
  // Substitua 'YOUR_PROJECT_ID.appspot.com' pelo seu bucket de armazenamento
  storageBucket: "familia-ribeiro-f692a.firebasestorage.app",
  // Substitua 'YOUR_MESSAGING_SENDER_ID' pelo seu ID de remetente
  messagingSenderId: "36243339331",
  // Substitua 'YOUR_APP_ID' pelo seu ID de aplicativo
  appId: "1:36243339331:web:7a35ba08968469bd7ebcf6"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Função auxiliar para exibir mensagens para o usuário
function mostrarMensagem(texto, tipo = 'sucesso') {
  const mensagemContainer = document.getElementById('mensagem-container');
  const mensagem = document.getElementById('mensagem');
  
  // Remove classes de cor anteriores
  mensagemContainer.classList.remove('bg-red-500', 'bg-green-500');

  if (tipo === 'erro') {
    mensagemContainer.classList.add('bg-red-500', 'text-white');
  } else {
    mensagemContainer.classList.add('bg-green-500', 'text-white');
  }

  mensagem.innerText = texto;
  mensagemContainer.classList.remove('hidden');
}

// Função auxiliar para limpar as mensagens
function limparMensagem() {
  const mensagemContainer = document.getElementById('mensagem-container');
  mensagemContainer.classList.add('hidden');
}

// Função de login
function login() {
  limparMensagem();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Checagem de admin.
      // Lembre-se: a principal segurança deve ser nas Firebase Security Rules, não aqui.
      if (email === "chriz.40ribeiro@gmail.com" || email === "chrizribeiro.42@gmail.com") {
        window.location.href = "admin.html";
      } else {
        // Redireciona usuários comuns para a página principal (ou de membro)
        mostrarMensagem("Login realizado com sucesso! Bem-vindo(a)!");
        // Exemplo: window.location.href = "principal.html";
      }
    })
    .catch((error) => {
      // Exibe a mensagem de erro do Firebase para o usuário
      mostrarMensagem("Erro ao fazer login: " + error.message, 'erro');
    });
}

// Função de criação de conta
function criarConta() {
  limparMensagem();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Adiciona o novo usuário ao Firestore com o status de 'aprovado: false'
      db.collection("usuarios").doc(user.uid).set({
        email: user.email,
        aprovado: false,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        mostrarMensagem("Conta criada com sucesso! Aguarde a aprovação do administrador.");
        // A página pode ser mantida, ou você pode redirecionar o usuário
      })
      .catch((error) => {
        // Se a criação no Firestore falhar, é uma boa prática remover o usuário do Auth também
        user.delete();
        mostrarMensagem("Erro ao salvar dados do usuário: " + error.message, 'erro');
      });
    })
    .catch((error) => {
      mostrarMensagem("Erro ao criar conta: " + error.message, 'erro');
    });
}
