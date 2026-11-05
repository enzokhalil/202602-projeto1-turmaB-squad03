// Navegação da tela Entenda suas contas (HU05)
const app = document.querySelector('bulbe-app');
const dialogo = document.querySelector('dialog');
const conta = 'cliente=1&instalacao=3013588579';

// telas do grupo que já existem
const destinos = {
  faturas: `hu02-contas.html?${conta}`,
  economia: 'hu01-minha-economia.html',
  contrato: './hu03-contratacao.html',
  ajuda: 'hu06-bulbe-mapa.html#/atendimento',
};

const nomes = { servico: 'Como a Bulbe funciona', indicacoes: 'Indique e ganhe' };

app.addEventListener('bulbe:navigate', (evento) => {
  const area = evento.detail.area;

  if (destinos[area]) {
    location.href = destinos[area];
    return;
  }

  // o template marca a área clicada, então volto para a HU05
  app.setAttribute('active-area', 'duas-contas');

  if (nomes[area]) {
    document.querySelector('#dialogo-titulo').textContent = nomes[area];
    dialogo.showModal();
  }
});

// leva até o detalhe da Cemig
document.querySelector('#ver-cemig').addEventListener('click', () => {
  const detalhe = document.querySelector('#detalhe-cemig');
  detalhe.scrollIntoView({ behavior: 'smooth', block: 'start' });
  detalhe.focus({ preventScroll: true });
});
