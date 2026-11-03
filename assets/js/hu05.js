import { buscarContasHu05 } from './api.js';

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// o mesmo valor aparece em mais de um lugar da tela
function preencherValor(classe, valor) {
  document.querySelectorAll(classe).forEach((elemento) => {
    elemento.textContent = formatarValor(valor);
  });
}

function mostrarItensCemig(itens) {
  const lista = document.querySelector('#itens-cemig');
  lista.innerHTML = itens
    .map((item) => `
      <div class="linha">
        <span>${item.nome} • exemplo</span>
        <strong>${formatarValor(item.valor)}</strong>
      </div>
    `)
    .join('');
}

async function iniciar() {
  try {
    const contas = await buscarContasHu05();

    document.querySelector('#referencia').textContent = contas.referencia;
    document.querySelector('#vencimento-bulbe').textContent = contas.bulbe.vencimento;
    document.querySelector('#vencimento-cemig').textContent = contas.cemig.vencimento;

    preencherValor('.valor-bulbe', contas.bulbe.valor);
    preencherValor('.valor-cemig', contas.cemig.valor);

    const total = contas.bulbe.valor + contas.cemig.valor;
    document.querySelector('#total').textContent = formatarValor(total);

    mostrarItensCemig(contas.cemig.itens);
  } catch (erro) {
    document.querySelector('#erro-dados').hidden = false;
    console.error(erro);
  }
}

iniciar();
