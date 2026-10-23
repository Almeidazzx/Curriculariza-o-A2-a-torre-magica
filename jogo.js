// A TORRE MÁGICA - JAVASCRIPT
// Aqui ficam as regras do jogo.
// Usamos variáveis, listas (arrays), if, for e funções.
// O jogo tem 3 áreas com 4 andares cada.

// VARIÁVEIS: guardam informações enquanto a criança joga.
var areaAtual = 0;
var andarAtual = 0;
var numeroPergunta = 0;
var acertos = 0;
var perguntasDoAndar = [];
var bloqueado = false;
var primeiraEscolha = "";
var progresso = Number(localStorage.getItem("torreProgresso") || 0);
var musica = document.getElementById("musica");

// LISTAS: nomes das áreas e assuntos de cada andar.
var nomesAreas = ["Floresta Encantada", "Vale dos Cristais", "Montanhas do Dragão"];
var assuntos = ["Cores", "Contagem e quantidades", "Grandezas e comparações", "Noções espaciais"];
var quantidades = [10, 20, 30];

var cores = [
  ["vermelho", "🔴"], ["azul", "🔵"], ["amarelo", "🟡"],
  ["verde", "🟢"], ["roxo", "🟣"], ["laranja", "🟠"]
];
var objetos = ["⭐", "🍎", "🌼", "🐟", "🦋", "🍀"];
var lugares = ["em cima", "embaixo", "à esquerda", "à direita"];

// Muda a tela sem precisar rolar a página.
// TELAS: mostra uma tela e esconde as outras.
function mostrarTela(nome) {
  var telas = document.querySelectorAll(".tela");
  for (var i = 0; i < telas.length; i++) {
    telas[i].classList.remove("ativa");
  }
  document.getElementById(nome).classList.add("ativa");
  window.scrollTo(0, 0);
}

// MAPA: mostra quais andares estão disponíveis.
function abrirMapa() {
  mostrarTela("mapa");
  mostrarAndares();
}

function mostrarAndares() {
  var areas = document.getElementById("areas");
  areas.innerHTML = "";
  for (var a = 0; a < 3; a++) {
    var botao = document.createElement("button");
    botao.textContent = "Área " + (a + 1) + " - " + nomesAreas[a];
    botao.disabled = progresso < a * 4;
    botao.onclick = function(indice) {
      return function() { areaAtual = indice; mostrarAndares(); };
    }(a);
    areas.appendChild(botao);
  }

  document.getElementById("nomeArea").textContent =
    "Área " + (areaAtual + 1) + " — " + nomesAreas[areaAtual];
  document.getElementById("mapa").className = "tela ativa area" + areaAtual;
  var andares = document.getElementById("andares");
  andares.innerHTML = "";

  for (var i = 0; i < 4; i++) {
    var numero = areaAtual * 4 + i;
    var b = document.createElement("button");
    var status = numero < progresso ? "✓ " : numero > progresso ? "🔒 " : "";
    b.textContent = status + "Andar " + (numero + 1) + " — " + assuntos[i];
    b.disabled = numero > progresso;
    b.onclick = function(n) {
      return function() { iniciarAndar(n); };
    }(numero);
    andares.appendChild(b);
  }
  document.getElementById("progresso").textContent =
    "Andares concluídos: " + progresso + "/12";
  trocarMusica();
}

// SORTEIO: troca a ordem das perguntas e das respostas.
function embaralhar(lista) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var sorteado = Math.floor(Math.random() * (i + 1));
    var auxiliar = copia[i];
    copia[i] = copia[sorteado];
    copia[sorteado] = auxiliar;
  }
  return copia;
}

// QUESTÕES DO FÁCIL: dez desafios diferentes em cada andar.
// Cada pergunta tem sua imagem, resposta e duas alternativas.
function criarPerguntaFacil(assunto, numero) {
  var perguntas = [
    [
      ["Que cor tem esta maçã?", "🍎", "vermelho", "verde"],
      ["Qual é a cor deste sol?", "☀️", "amarelo", "azul"],
      ["Que cor aparece neste coração?", "💚", "verde", "vermelho"],
      ["Qual cor lembra o céu sem nuvens?", "🌤️", "azul", "roxo"],
      ["Qual é a cor desta uva?", "🍇", "roxo", "laranja"],
      ["De que cor é esta laranja?", "🍊", "laranja", "verde"],
      ["Qual destes nomes combina com a figura?", "🔴", "vermelho", "azul"],
      ["O coração é amarelo?", "💛", "Verdadeiro", "Falso"],
      ["Leve a cor da folha até a caixa.", "🍃", "verde", "roxo"],
      ["Ligue a cor ao desenho do mar.", "🌊", "azul", "amarelo"]
    ],
    [
      ["Quantas maçãs existem?", "🍎 🍎", "2", "3"],
      ["Conte as estrelas.", "⭐ ⭐ ⭐", "3", "4"],
      ["Quantas borboletas você vê?", "🦋", "1", "2"],
      ["Quantas flores há no jardim?", "🌼 🌼 🌼 🌼", "4", "5"],
      ["Qual número vem depois do 2?", "1　2　?", "3", "4"],
      ["Quantos peixes estão nadando?", "🐟 🐟 🐟 🐟 🐟", "5", "6"],
      ["Qual grupo tem mais frutas?", "🍎 🍎　|　🍌 🍌 🍌", "Bananas", "Maçãs"],
      ["Existem duas estrelas?", "⭐ ⭐", "Verdadeiro", "Falso"],
      ["Leve o número de bolas até a caixa.", "⚽ ⚽ ⚽", "3", "2"],
      ["Ligue a quantidade de sóis ao número.", "☀️ ☀️ ☀️ ☀️", "4", "3"]
    ],
    [
      ["Qual estrela é maior?", "<span style='font-size:90px'>⭐</span> <span style='font-size:38px'>⭐</span>", "A primeira", "A segunda"],
      ["Qual árvore é menor?", "<span style='font-size:42px'>🌳</span> <span style='font-size:85px'>🌳</span>", "A primeira", "A segunda"],
      ["Qual bola é maior?", "<span style='font-size:35px'>⚽</span> <span style='font-size:85px'>⚽</span>", "A segunda", "A primeira"],
      ["Qual flor é menor?", "<span style='font-size:80px'>🌻</span> <span style='font-size:35px'>🌻</span>", "A segunda", "A primeira"],
      ["Qual objeto é mais comprido?", "<div>━━━━━━</div><div>━━</div>", "O de cima", "O de baixo"],
      ["Qual grupo tem menos estrelas?", "⭐ ⭐　|　⭐ ⭐ ⭐ ⭐", "O primeiro", "O segundo"],
      ["Qual grupo tem mais maçãs?", "🍎 🍎 🍎　|　🍎", "O primeiro", "O segundo"],
      ["A segunda estrela é maior?", "<span style='font-size:80px'>⭐</span> <span style='font-size:35px'>⭐</span>", "Falso", "Verdadeiro"],
      ["Leve a posição da bola menor até a caixa.", "<span style='font-size:85px'>⚽</span> <span style='font-size:35px'>⚽</span>", "A segunda", "A primeira"],
      ["Ligue o grupo com menos flores à resposta.", "🌼 🌼　|　🌼 🌼 🌼", "O primeiro", "O segundo"]
    ],
    [
      ["Onde está a estrela?", "<div>⭐</div><div>🏠</div>", "Em cima", "Embaixo"],
      ["Onde está a estrela?", "<div>🏠</div><div>⭐</div>", "Embaixo", "Em cima"],
      ["Onde está a estrela em relação à casa?", "⭐　🏠", "À esquerda", "À direita"],
      ["Onde está a estrela em relação à casa?", "🏠　⭐", "À direita", "À esquerda"],
      ["Onde está o pássaro?", "<div>🐦</div><div>🌳</div>", "Em cima", "Embaixo"],
      ["Onde está o peixe em relação ao barco?", "<div>⛵</div><div>🐟</div>", "Embaixo", "Em cima"],
      ["Onde está a maçã em relação à árvore?", "🍎　🌳", "À esquerda", "À direita"],
      ["A estrela está embaixo da casa?", "<div>⭐</div><div>🏠</div>", "Falso", "Verdadeiro"],
      ["Leve a posição da flor até a caixa.", "🌳　🌼", "À direita", "À esquerda"],
      ["Ligue a posição do sol em relação à casa.", "<div>☀️</div><div>🏠</div>", "Em cima", "Embaixo"]
    ]
  ];
  var dados = perguntas[assunto][numero];
  var p = {};
  p.texto = dados[0];
  p.figura = dados[1];
  p.certa = dados[2];
  p.opcoes = [dados[2], dados[3]];
  p.tipo = "escolha";
  if (numero === 7) p.tipo = "verdadeiro";
  if (numero === 7) p.frase = p.texto;
  if (numero === 8) p.tipo = "arrastar";
  if (numero === 9) p.tipo = "ligar";
  return p;
}

// Gera perguntas com exemplos variados, de acordo com o assunto.
// PERGUNTAS: cria desafios de cores, números, tamanhos e posições.
function criarPergunta(assunto, numero) {
  if (areaAtual === 0) return criarPerguntaFacil(assunto, numero);

  var p = {};
  p.tipo = "escolha";

  if (assunto === 0) {
    var cor = cores[numero % cores.length];
    p.texto = "Qual é a cor desta figura?";
    p.figura = cor[1];
    p.certa = cor[0];
    p.opcoes = [cor[0], cores[(numero + 1) % 6][0], cores[(numero + 3) % 6][0], cores[(numero + 4) % 6][0]];
  }
  if (assunto === 1) {
    var quantidade = numero % 8 + 1;
    p.texto = "Quantos objetos aparecem?";
    p.figura = Array(quantidade + 1).join(objetos[numero % objetos.length] + " ");
    p.certa = String(quantidade);
    p.opcoes = [String(quantidade), String(quantidade + 1), String(Math.max(1, quantidade - 1)), String(quantidade + 2)];
  }
  if (assunto === 2) {
    var maior = numero % 2 === 0;
    p.texto = maior ? "Qual figura é maior?" : "Qual figura é menor?";
    p.figura = '<span style="font-size:90px">⭐</span> <span style="font-size:35px">⭐</span>';
    p.certa = maior ? "A primeira" : "A segunda";
    p.opcoes = ["A primeira", "A segunda", "As duas", "Nenhuma"];
  }
  if (assunto === 3) {
    var posicao = lugares[numero % 4];
    p.texto = "Onde está a estrela em relação à casa?";
    p.certa = posicao;
    p.opcoes = lugares.slice();
    if (posicao === "em cima") p.figura = '<div>⭐</div><div>🏠</div>';
    if (posicao === "embaixo") p.figura = '<div>🏠</div><div>⭐</div>';
    if (posicao === "à esquerda") p.figura = "⭐　🏠";
    if (posicao === "à direita") p.figura = "🏠　⭐";
  }

  // Nos modos médio e difícil, algumas perguntas usam atividades diferentes.
  if (areaAtual > 0 && numero % 5 === 0) p.tipo = "verdadeiro";
  if (areaAtual > 0 && numero % 5 === 1) p.tipo = "arrastar";
  if (areaAtual > 0 && numero % 5 === 2) p.tipo = "ligar";
  return p;
}

// COMEÇAR: prepara a lista de perguntas do andar.
function iniciarAndar(numero) {
  andarAtual = numero;
  areaAtual = Math.floor(numero / 4);
  numeroPergunta = 0;
  acertos = 0;
  bloqueado = false;
  perguntasDoAndar = [];

  var total = quantidades[areaAtual];
  for (var i = 0; i < total; i++) {
    perguntasDoAndar.push(criarPergunta(numero % 4, i));
  }
  perguntasDoAndar = embaralhar(perguntasDoAndar);
  document.getElementById("jogo").className = "tela ativa area" + areaAtual;
  mostrarPergunta();
  trocarMusica();
}

// MOSTRAR PERGUNTA: coloca o enunciado e as opções na tela.
function mostrarPergunta() {
  if (numeroPergunta >= perguntasDoAndar.length) {
    terminarAndar();
    return;
  }
  bloqueado = false;
  primeiraEscolha = "";
  var p = perguntasDoAndar[numeroPergunta];
  var total = perguntasDoAndar.length;
  document.getElementById("informacao").textContent =
    "Área " + (areaAtual + 1) + " — Andar " + (andarAtual + 1) +
    " — " + (numeroPergunta + 1) + "/" + total;
  document.getElementById("barraInterna").style.width = (numeroPergunta / total * 100) + "%";
  document.getElementById("pergunta").textContent = p.tipo === "ligar" ? "Ligue os três pares corretos!" : p.texto;
  document.getElementById("mensagem").textContent = "";
  var lugar = document.getElementById("atividade");
  lugar.innerHTML = "";

  var cena = document.createElement("div");
  cena.className = "cena";
  cena.innerHTML = '<div class="figura">' + p.figura + '</div>';
  lugar.appendChild(cena);

  if (p.tipo === "verdadeiro") {
    var afirmacao = document.createElement("h3");
    if (p.certa === "Verdadeiro" || p.certa === "Falso") {
      afirmacao.textContent = p.frase || p.texto;
      lugar.appendChild(afirmacao);
      criarBotao(lugar, "Verdadeiro", p.certa === "Verdadeiro");
      criarBotao(lugar, "Falso", p.certa === "Falso");
    } else {
      var afirmado = Math.random() < .5 ? p.certa : p.opcoes.filter(function(x) { return x !== p.certa; })[0];
      afirmacao.textContent = "A resposta é: " + afirmado + ". Verdadeiro ou falso?";
      lugar.appendChild(afirmacao);
      criarBotao(lugar, "Verdadeiro", afirmado === p.certa);
      criarBotao(lugar, "Falso", afirmado !== p.certa);
    }
  } else if (p.tipo === "arrastar") {
    var aviso = document.createElement("p");
    aviso.textContent = "Toque na resposta e depois na caixa, ou arraste a resposta.";
    lugar.appendChild(aviso);
    var opcoes = embaralhar(p.opcoes).slice(0, areaAtual === 1 ? 3 : 4);
    if (opcoes.indexOf(p.certa) === -1) opcoes[0] = p.certa;
    for (var i = 0; i < opcoes.length; i++) {
      var item = document.createElement("button");
      item.textContent = opcoes[i];
      item.draggable = true;
      item.onclick = function(valor) {
        return function() { primeiraEscolha = valor; };
      }(opcoes[i]);
      item.ondragstart = function(valor) {
        return function(evento) { evento.dataTransfer.setData("text", valor); };
      }(opcoes[i]);
      lugar.appendChild(item);
    }
    var alvo = document.createElement("div");
    alvo.className = "alvo";
    alvo.textContent = "Coloque a resposta aqui";
    alvo.onclick = function() { if (primeiraEscolha) responder(primeiraEscolha === p.certa); };
    alvo.ondragover = function(evento) { evento.preventDefault(); };
    alvo.ondrop = function(evento) {
      evento.preventDefault();
      responder(evento.dataTransfer.getData("text") === p.certa);
    };
    lugar.appendChild(alvo);
  } else if (p.tipo === "ligar") {
    // Associação: ligar três objetos às palavras correspondentes.
    var pares;
    if (andarAtual % 4 === 0) {
      pares = [["🍎", "vermelho"], ["🌿", "verde"], ["☀️", "amarelo"]];
    } else if (andarAtual % 4 === 1) {
      pares = [["⭐ ⭐", "2"], ["🍎 🍎 🍎", "3"], ["🌼 🌼 🌼 🌼", "4"]];
    } else if (andarAtual % 4 === 2) {
      pares = [["⭐ grande", "maior"], ["⭐ pequena", "menor"], ["━━━", "curto"]];
    } else {
      pares = [["⭐ acima da casa", "em cima"], ["⭐ abaixo da casa", "embaixo"],
               ["⭐ à direita da casa", "à direita"]];
    }
    var instrucao = document.createElement("p");
    instrucao.textContent = "Ligue cada figura à resposta. Toque na figura e depois na palavra.";
    lugar.appendChild(instrucao);
    var painel = document.createElement("div");
    painel.className = "pares";
    var esquerda = document.createElement("div");
    var direita = document.createElement("div");
    esquerda.className = "coluna-pares";
    direita.className = "coluna-pares";
    var respostas = embaralhar(pares);
    var escolhas = embaralhar(pares);
    var selecionado = -1;
    var usados = [];
    var certos = 0;
    var tentativas = 0;
    for (var j = 0; j < respostas.length; j++) {
      var figura = document.createElement("button");
      figura.textContent = respostas[j][0];
      figura.onclick = function(indice, botao) {
        return function() {
          if (bloqueado || usados.indexOf(indice) >= 0) return;
          selecionado = indice;
          var todos = esquerda.querySelectorAll("button");
          for (var k = 0; k < todos.length; k++) todos[k].classList.remove("selecionado");
          botao.classList.add("selecionado");
        };
      }(j, figura);
      esquerda.appendChild(figura);
    }
    for (var k = 0; k < escolhas.length; k++) {
      var palavra = document.createElement("button");
      palavra.textContent = escolhas[k][1];
      palavra.onclick = function(resposta, botao) {
        return function() {
          if (bloqueado || selecionado < 0 || botao.disabled) return;
          tentativas++;
          if (respostas[selecionado][1] === resposta) {
            certos++;
            usados.push(selecionado);
            esquerda.children[selecionado].disabled = true;
            botao.disabled = true;
            document.getElementById("mensagem").textContent = "Par correto!";
          } else {
            document.getElementById("mensagem").textContent = "Esses não combinam. Tente outro!";
          }
          selecionado = -1;
          if (certos === 3) responder(tentativas === 3);
        };
      }(escolhas[k][1], palavra);
      direita.appendChild(palavra);
    }
    painel.appendChild(esquerda);
    painel.appendChild(direita);
    lugar.appendChild(painel);
  } else {
    var caixa = document.createElement("div");
    caixa.className = "opcoes";
    var alternativas = embaralhar(p.opcoes);
    var limite = areaAtual === 0 ? 2 : areaAtual === 1 ? 3 : 4;
    alternativas = alternativas.slice(0, limite);
    if (alternativas.indexOf(p.certa) === -1) alternativas[0] = p.certa;
    alternativas = embaralhar(alternativas);
    for (var n = 0; n < alternativas.length; n++) {
      criarBotao(caixa, alternativas[n], alternativas[n] === p.certa);
    }
    lugar.appendChild(caixa);
  }
}

function criarBotao(lugar, texto, correto) {
  var botao = document.createElement("button");
  botao.textContent = texto;
  botao.onclick = function() { responder(correto); };
  lugar.appendChild(botao);
}

// RESPOSTA: soma um acerto quando estiver certa.
function responder(correto) {
  if (bloqueado) return;
  bloqueado = true;
  if (correto) {
    acertos++;
    document.getElementById("mensagem").textContent = "Muito bem! Você acertou!";
  } else {
    document.getElementById("mensagem").textContent = "Boa tentativa! Vamos para a próxima.";
  }
  setTimeout(function() {
    numeroPergunta++;
    mostrarPergunta();
  }, 1100);
}

// RESULTADO: mostra os acertos e libera o próximo andar.
function terminarAndar() {
  if (andarAtual === progresso) {
    progresso++;
    localStorage.setItem("torreProgresso", progresso);
  }
  document.getElementById("nota").textContent = acertos + "/" + perguntasDoAndar.length + " acertos";
  // O último andar termina com a vitória do cavaleiro.
  if (andarAtual === 11) {
    document.getElementById("notaFinal").textContent =
      "Último andar: " + acertos + " de " + perguntasDoAndar.length + " acertos!";
    mostrarTela("vitoria");
  } else {
    mostrarTela("resultado");
  }
}

function jogarNovamente() {
  // Começa de novo, mas não apaga os andares já desbloqueados.
  iniciarAndar(0);
}

function repetir() { iniciarAndar(andarAtual); }
function proximoAndar() {
  if (andarAtual < 11 && andarAtual + 1 <= progresso) iniciarAndar(andarAtual + 1);
  else abrirMapa();
}
function sair() { mostrarTela("inicio"); }

// Configurações e voz
function abrirConfiguracoes() { mostrarTela("configuracoes"); }
// VOZ: lê a pergunta usando a voz do navegador.
function falar(texto) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  var voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "pt-BR";
  voz.rate = 0.85;
  voz.volume = Number(document.getElementById("volumeVoz").value) / 100;
  speechSynthesis.speak(voz);
}
function ouvirPergunta() {
  var p = perguntasDoAndar[numeroPergunta];
  if (p) falar(p.texto);
}
function ouvirTeste() { falar("Olá! Bem-vindo à Torre Mágica!"); }
// MÚSICA: liga, desliga e ajusta o volume.
function alterarMusica() {
  localStorage.setItem("musicaLigada", document.getElementById("musicaLigada").checked);
  tocarMusica();
}
function ajustarVolumes() {
  var v = document.getElementById("volumeMusica").value;
  var voz = document.getElementById("volumeVoz").value;
  document.getElementById("numeroMusica").textContent = v;
  document.getElementById("numeroVoz").textContent = voz;
  musica.volume = v / 100;
  localStorage.setItem("volumeMusica", v);
  localStorage.setItem("volumeVoz", voz);
}
function tocarMusica() {
  if (document.getElementById("musicaLigada").checked) {
    musica.play().catch(function() { /* O navegador pode exigir um clique. */ });
  } else {
    musica.pause();
  }
}
function trocarMusica() {
  var arquivo = "musica" + (areaAtual + 1) + ".wav";
  if (!musica.src.endsWith(arquivo)) {
    musica.src = arquivo;
    musica.load();
  }
  tocarMusica();
}

// Carrega preferências salvas.
document.getElementById("musicaLigada").checked = localStorage.getItem("musicaLigada") === "true";
document.getElementById("volumeMusica").value = localStorage.getItem("volumeMusica") || 50;
document.getElementById("volumeVoz").value = localStorage.getItem("volumeVoz") || 90;
ajustarVolumes();
mostrarTela("inicio");
