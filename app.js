const formAdicionar = document.getElementById("form-adicionar");
const inputItem = document.getElementById("input-item");
const listaItens = document.getElementById("container"); 
const contadorItensLista = document.getElementById("contador-itens-lista");
const contadorConcluidos = document.getElementById("contador-itens-concluidos");
const contadorPendentes = document.getElementById("contador-itens-pendentes");
const filtroStatus = document.getElementById("filtro-status");
const bntAtualizarLista = document.getElementById("atualizar-filtro")
const btnLimpar = document.getElementById("btn-limpar");

let itens = [];

formAdicionar.addEventListener("submit", (event) => {
  event.preventDefault();

  const novoItemTexto = inputItem.value.trim();
  if (novoItemTexto === '') return;

  itens.push({ texto: novoItemTexto, concluido: false });

  salvarDados();
  renderizarLista();
  inputItem.value = '';
});

function salvarDados() {
  localStorage.setItem('listaTarefas', JSON.stringify(itens));
}

window.addEventListener('DOMContentLoaded', () => {
  const dados = localStorage.getItem('listaTarefas');
  if (dados) {
    itens = JSON.parse(dados);
  }
  renderizarLista();
});

function renderizarLista() {
  let listaExibida = [...itens];
  const status = filtroStatus.value;

  if (status === 'concluido') {
    listaExibida = listaExibida.filter(i => i.concluido);
  } else if (status === 'pendentes') {
    listaExibida = listaExibida.filter(i => !i.concluido);
  }

  listaItens.innerHTML = '';

  listaExibida.forEach((item, index) => {
    const divBotoes = document.createElement('div');
    divBotoes.className = "divBotoes";
    const li = document.createElement('li');
    const spanTexto = document.createElement('span');
    spanTexto.textContent = item.texto;
    if (item.concluido) {
      spanTexto.style.textDecoration = "line-through";
    }

    const btnStatusItem = document.createElement('button');
    btnStatusItem.textContent = item.concluido ? "Concluído" : "Pendente";
    btnStatusItem.className = "botao-ver botao-lar";
    btnStatusItem.addEventListener('click', () => {
      item.concluido = !item.concluido;
      salvarDados();
      renderizarLista();
    });

    const btnRemover = document.createElement('button');
    btnRemover.className = 'botoesVermelhos';
    btnRemover.textContent = 'X';
    btnRemover.addEventListener('click', () => {
      removerItem(index);
    });

    li.appendChild(spanTexto);
    divBotoes.appendChild(btnStatusItem);
    divBotoes.appendChild(btnRemover);
    li.appendChild(divBotoes);
    listaItens.appendChild(li);
  });

  contadorItensLista.textContent = `Itens na lista: ${itens.length}`;
  contadorConcluidos.textContent = `Concluídos: ${itens.filter(i => i.concluido).length}`;
  contadorPendentes.textContent = `Pendentes: ${itens.filter(i => !i.concluido).length}`;
}

function removerItem(index) {
  itens.splice(index, 1);
  salvarDados();
  renderizarLista();
}

btnLimpar.addEventListener('click', () => {
  if (confirm('Deseja limpar toda a lista?')) {
    itens = [];
    salvarDados();
    renderizarLista();
  }
})

bntAtualizarLista.addEventListener('click', () => {
  renderizarLista();
})
