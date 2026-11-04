// GERADO por scripts/gerar-demo-hu02.py. Não editar diretamente.
// Somente dados fictícios. Em HTTP, o loader usa api.js/fetch normalmente.
(() => {
const demo = {"clientes":[{"id":1,"nome":"Marina Souza","cidade":"Contagem","dataAdesao":"2026-09-02","status":"em_conexao","canalPreferido":"whatsapp","whatsappConfirmado":false,"emailConfirmado":true,"consumoMedioKwh":310,"descontoPercentual":15},{"id":2,"nome":"João Pereira","cidade":"Belo Horizonte","dataAdesao":"2026-08-14","status":"conectado","canalPreferido":"email","whatsappConfirmado":true,"emailConfirmado":true,"consumoMedioKwh":220,"descontoPercentual":15},{"id":3,"nome":"Ana Ribeiro","cidade":"Uberlândia","dataAdesao":"2026-09-20","status":"aguardando_qualificacao","canalPreferido":"app","whatsappConfirmado":true,"emailConfirmado":false,"consumoMedioKwh":180,"descontoPercentual":12}],"faturas":[{"id":101,"clienteId":2,"referencia":"2026-09","vencimento":"2026-10-10","valor":168.4,"economia":29.72,"status":"aberta","pixCopiaECola":"PIX-FICTICIO-0001"},{"id":102,"clienteId":1,"referencia":"2026-11","vencimento":"2026-12-12","valor":231.9,"economia":40.92,"status":"prevista","pixCopiaECola":null,"instalacao":"3013588579"},{"id":201,"clienteId":1,"instalacao":"3013588579","referencia":"2026-10","vencimento":"2026-11-12","valor":260.72,"economia":46.01,"energiaElegivel":306.73,"outros":0,"status":"aberta","pixCopiaECola":null},{"id":202,"clienteId":1,"instalacao":"3013588579","referencia":"2026-09","vencimento":"2026-10-12","valor":212.2,"status":"paga","pixCopiaECola":null},{"id":203,"clienteId":1,"instalacao":"3013588579","referencia":"2026-08","vencimento":"2026-09-12","valor":252.06,"status":"paga","pixCopiaECola":null},{"id":204,"clienteId":1,"instalacao":"3013588579","referencia":"2026-07","vencimento":"2026-08-12","valor":242.59,"status":"paga","pixCopiaECola":null}]};
async function buscarClientes() { return demo.clientes; }
async function buscarFaturasDoCliente(clienteId) {
  return demo.faturas.filter((fatura) => fatura.clienteId === clienteId);
}
// Regras da HU02, separadas da apresentação para permitir testes.
function situacao(fatura, hoje = new Date()) {
  if (fatura.status === 'paga') return 'paga';
  if (fatura.status === 'prevista') return 'prevista';
  const data = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  return fatura.status === 'vencida' || fatura.vencimento < data ? 'vencida' : 'aberta';
}

function ordenarContas(contas) {
  return [...contas].sort((a, b) => b.referencia.localeCompare(a.referencia) || b.id - a.id);
}

function proximaConta(contas, hoje = new Date()) {
  const emitidas = contas.filter((f) => ['aberta', 'vencida'].includes(situacao(f, hoje)));
  return [...emitidas].sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0]
    || ordenarContas(contas.filter((f) => situacao(f, hoje) === 'prevista'))[0]
    || ordenarContas(contas)[0];
}

const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
const dataCurta = (valor) => valor.split('-').reverse().slice(0, 2).join('/');
const dataCompleta = (valor) => valor.split('-').reverse().join('/');
function referencia(valor, curta = false) {
  const [ano, mes] = valor.split('-').map(Number);
  const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(ano, mes - 1, 1));
  return `${nome[0].toUpperCase()}${nome.slice(1)}/${curta ? String(ano).slice(2) : ano}`;
}


const app = document.querySelector('bulbe-app');
const conteudo = document.querySelector('#conteudo-contas');
const tela = document.body.dataset.hu02Tela;
const params = new URLSearchParams(location.search);
const clienteId = Number(params.get('cliente') || 1); // Identidade simulada, sem autenticação.
const rotulos = { aberta: 'Em aberto', paga: 'Paga', prevista: 'Prevista', vencida: 'Vencida' };
let contas = [];
let instalacao = params.get('instalacao') || '';
let ultimoFoco;

const escapar = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const iconeRelogio = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const imagem = (nome) => `<img src="../assets/img/app-template/${nome}.svg" alt="">`;
const chevron = '<img class="hu02-chevron" src="../assets/img/app-template/chevron.svg" alt="">';
const badge = (f, wide = false, prefixo = '') => `<span class="hu02-status hu02-status--${situacao(f)}${wide ? ' hu02-status--wide' : ''}">${escapar(prefixo)}${rotulos[situacao(f)]}</span>`;

function url(pagina, id) {
  const query = new URLSearchParams({ cliente: String(clienteId) });
  if (instalacao) query.set('instalacao', instalacao);
  if (id !== undefined) query.set('id', String(id));
  return `${pagina}.html?${query}`;
}

function acao({ titulo, texto, icon, href, area, pagamento, green }) {
  const tag = href ? 'a' : 'button';
  const attr = href ? `href="${escapar(href)}"` : `type="button" ${pagamento ? 'data-pagamento' : `data-area="${area}"`}`;
  return `<${tag} class="hu02-action${green ? ' hu02-action--green' : ''}" ${attr}>
    <span class="hu02-action__icon">${icon}</span><span class="hu02-action__copy"><strong>${titulo}</strong><small>${texto}</small></span>${chevron}</${tag}>`;
}

const ajuda = (texto = 'Não encontrou sua conta? Pedir ajuda') => `<button type="button" class="hu02-text-link" data-area="ajuda">${texto} →</button>`;

function mensagem(titulo, texto, tentar = false) {
  conteudo.innerHTML = `<div class="hu02-card hu02-feedback"><h2>${titulo}</h2><p>${texto}</p>${tentar ? '<button class="hu02-button" type="button" data-tentar>Tentar novamente</button>' : ajuda()}</div>`;
}

function renderContas(lista) {
  const f = proximaConta(lista);
  const status = situacao(f);
  const titulo = status === 'prevista' ? 'Sua próxima conta está prevista' : status === 'paga' ? 'Sua última conta está paga' : status === 'vencida' ? 'Sua conta precisa de atenção' : 'Sua próxima conta';
  document.querySelector('#saudacao').textContent = `${document.querySelector('#saudacao').dataset.nome}, ${status === 'paga' ? 'suas contas estão em dia.' : status === 'prevista' ? 'acompanhe a previsão da sua conta.' : 'sua próxima conta está aqui.'}`;
  conteudo.innerHTML = `<article class="hu02-card hu02-card--cream">
    <h2>${titulo}</h2><div class="hu02-meta"><span>${status === 'paga' || status === 'vencida' ? 'Venceu' : 'Vence'} em ${dataCompleta(f.vencimento)}</span>${badge(f)}</div>
    <p class="hu02-amount">${moeda(f.valor)}</p><p class="hu02-small">Bulbe · referência ${referencia(f.referencia).toLowerCase()}</p>
    ${status === 'prevista' ? '<p class="hu02-notice">Valor estimado. Esta conta ainda não foi emitida e não está disponível para pagamento.</p>' : ''}
    <a class="hu02-button" href="${url('fatura', f.id)}">${status === 'prevista' ? 'Ver previsão' : 'Abrir fatura'}</a>
    </article><div class="hu02-actions">
    ${acao({ titulo: 'Histórico de contas', texto: 'Referência, valor e situação', icon: iconeRelogio, href: url('historico') })}
    ${acao({ titulo: 'Entenda suas contas', texto: 'Por que recebo contas da Bulbe e da Cemig?', icon: imagem('duas-contas'), area: 'duas-contas' })}
    ${acao({ titulo: 'Minha economia', texto: 'Confira o benefício deste mês', icon: imagem('economia'), area: 'economia', green: true })}
    </div>${ajuda()}`;
}

function renderFatura(lista) {
  const f = params.has('id') ? lista.find((item) => String(item.id) === params.get('id')) : proximaConta(lista);
  if (!f) { mensagem('Conta não encontrada', 'Esta conta não está disponível para o cliente e a instalação selecionados. Volte para Minhas contas para consultar as contas disponíveis.'); return; }
  const status = situacao(f);
  document.querySelector('#contexto').textContent = `${referencia(f.referencia)}${f.instalacao ? ` · instalação ${f.instalacao}` : ''}`;
  const temDetalhamento = Number.isFinite(f.energiaElegivel) && Number.isFinite(f.economia) && Number.isFinite(f.outros);
  conteudo.innerHTML = `<article class="hu02-card hu02-card--cream">
    <h2>${status === 'prevista' ? 'Estimativa da próxima conta' : 'Valor desta cobrança'}</h2>${badge(f, true)}
    <p class="hu02-amount">${moeda(f.valor)}</p>
    <p class="hu02-small">Vencimento: <strong>${dataCompleta(f.vencimento)}</strong></p>
    ${temDetalhamento ? `<dl class="hu02-breakdown"><div><dt>Energia elegível</dt><dd>${moeda(f.energiaElegivel)}</dd></div><div><dt>Desconto de energia</dt><dd class="hu02-discount">− ${moeda(f.economia)}</dd></div><div><dt>Outros e bônus</dt><dd>${moeda(f.outros)}</dd></div></dl>` : ''}
    ${status === 'prevista' ? '<p class="hu02-notice">Valor estimado. A conta ainda não foi emitida. Não há pagamento disponível.</p>' : status === 'paga' ? '<p class="hu02-small">Pagamento registrado nesta demonstração.</p>' : ''}
    </article><div class="hu02-actions">
    ${['aberta', 'vencida'].includes(status) ? acao({ titulo: 'Pix ou boleto', texto: 'Orientações para pagar esta conta', icon: imagem('faturas'), pagamento: true }) : ''}
    ${acao({ titulo: 'Conferir a economia', texto: 'Cálculo e comparação com a proposta', icon: imagem('economia'), area: 'economia', green: true })}
    ${acao({ titulo: 'Entenda suas contas', texto: 'Por que recebo duas cobranças?', icon: imagem('duas-contas'), area: 'duas-contas' })}
    </div><section class="hu02-card hu02-before"><h2>Antes de pagar</h2><p>Confira o emissor, a instalação, o valor, o vencimento e o beneficiário no documento oficial.</p><p>No Pix, use o código emitido para esta fatura. No boleto, confira o documento antes de confirmar.</p><span class="hu02-notice">Protótipo: não há código de pagamento válido.</span>${ajuda('Preciso de ajuda para pagar')}</section>`;
}

function renderHistorico(lista) {
  const emitidas = ordenarContas(lista.filter((f) => situacao(f) !== 'prevista'));
  const previstas = ordenarContas(lista.filter((f) => situacao(f) === 'prevista'));
  const atual = proximaConta(emitidas);
  const itens = (f) => `<li><a class="hu02-invoice-link" href="${url('fatura', f.id)}" aria-label="Ver detalhes de ${referencia(f.referencia)}, ${rotulos[situacao(f)]}, ${moeda(f.valor)}">
      ${badge(f, true, `${referencia(f.referencia, true)} · `)}<div class="hu02-meta"><span>${['paga', 'vencida'].includes(situacao(f)) ? 'Venceu' : 'Vence'} em ${dataCurta(f.vencimento)}</span><strong>${moeda(f.valor)}</strong></div>
      ${f.id === atual?.id && ['aberta', 'vencida'].includes(situacao(f)) ? '<span class="hu02-button hu02-button--soft">Abrir fatura atual</span>' : ''}
      </a></li>`;
  document.querySelector('#contexto').textContent = `${instalacao ? `Instalação ${instalacao} · ` : ''}${[...new Set(lista.map((f) => f.referencia.slice(0, 4)))].sort().join(' / ')}`;
  conteudo.innerHTML = `<section class="hu02-card hu02-card--cream"><h2>Contas mais recentes</h2>${emitidas.length ? `<ul class="hu02-list">${emitidas.map(itens).join('')}</ul>` : '<p class="hu02-small">Nenhuma conta emitida até o momento.</p>'}</section>${ajuda('Não encontro uma conta')}
    ${previstas.length ? `<section class="hu02-card hu02-before"><h2>Próximas contas previstas</h2><p class="hu02-small">Estimativas ainda não emitidas. Não disponíveis para pagamento.</p><ul class="hu02-list">${previstas.map(itens).join('')}</ul></section>` : ''}`;
}

function render() {
  const lista = contas.filter((f) => !instalacao || f.instalacao === instalacao);
  for (const link of document.querySelectorAll('[data-voltar]')) link.href = url('contas');
  if (!lista.length) { mensagem('Você ainda não tem contas disponíveis', 'Assim que uma conta estiver disponível, você poderá consultar o valor, o vencimento e a situação aqui.'); return; }
  ({ contas: renderContas, fatura: renderFatura, historico: renderHistorico })[tela](lista);
}

async function carregar() {
  conteudo.setAttribute('aria-busy', 'true');
  conteudo.innerHTML = '<div class="hu02-card hu02-feedback" role="status">Carregando suas contas…</div>';
  try {
    const [clientes, faturas] = await Promise.all([buscarClientes(), buscarFaturasDoCliente(clienteId)]);
    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) throw new Error('cliente-invalido');
    contas = faturas;
    app.setAttribute('profile-initial', cliente.nome[0]);
    const saudacao = document.querySelector('#saudacao');
    if (saudacao) { saudacao.dataset.nome = cliente.nome.split(' ')[0]; saudacao.textContent = `${saudacao.dataset.nome}, acompanhe suas contas aqui.`; }
    const instalacoes = [...new Set(contas.map((f) => f.instalacao).filter(Boolean))];
    if (!instalacao && instalacoes.length === 1) instalacao = instalacoes[0];
    const select = document.querySelector('#instalacao');
    if (select) {
      select.innerHTML = (instalacoes.length > 1 || (instalacao && !instalacoes.includes(instalacao)) ? '<option value="">Todas as instalações</option>' : '') + instalacoes.map((i) => `<option value="${escapar(i)}">${escapar(i)}</option>`).join('');
      select.value = instalacao;
      document.querySelector('#instalacao-label').hidden = !instalacoes.length;
    }
    render();
  } catch (error) {
    mensagem(error.message === 'cliente-invalido' ? 'Cliente não encontrado' : 'Não foi possível carregar suas contas', error.message === 'cliente-invalido' ? 'Este cliente não existe nos dados de demonstração. Abra a página sem o parâmetro cliente para consultar Marina.' : 'Confira sua conexão e tente novamente. Abra o projeto com o Live Server para carregar os dados de demonstração.', true);
  } finally {
    conteudo.setAttribute('aria-busy', 'false');
  }
}

function dialogo(titulo, texto) {
  ultimoFoco = document.activeElement;
  document.querySelector('#dialogo-titulo').textContent = titulo;
  document.querySelector('#dialogo-texto').textContent = texto;
  document.querySelector('dialog').showModal();
}

// As páginas das outras HUs ainda não existem na main. Centralize os destinos
// aqui quando forem entregues, sem modificar o template compartilhado.
const destinos = { faturas: () => url('contas') };
const nomes = { economia: 'Minha economia', contrato: 'Minha contratação', servico: 'Como a Bulbe funciona', 'duas-contas': 'Entenda suas contas', ajuda: 'Atendimento', indicacoes: 'Indique e ganhe' };
function navegar(area) {
  if (destinos[area]) { location.href = destinos[area](); return; }
  app.setAttribute('active-area', 'faturas');
  dialogo(nomes[area] || 'Outra área', 'Esta área será conectada à tela do integrante responsável quando ela estiver disponível. Nesta entrega, você pode navegar por Minhas contas, Minha fatura e Histórico de contas.');
}

app.addEventListener('bulbe:navigate', (event) => navegar(event.detail.area));
document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-tentar], [data-area], [data-pagamento]');
  if (!target) return;
  if (target.hasAttribute('data-tentar')) carregar();
  else if (target.hasAttribute('data-pagamento')) dialogo('Pix ou boleto', 'Esta é uma demonstração. Não há código Pix ou boleto válido e nenhum pagamento será realizado. No aplicativo real, use o documento oficial da fatura selecionada e confira os dados antes de pagar.');
  else navegar(target.dataset.area);
});
document.querySelector('#instalacao')?.addEventListener('change', (event) => {
  instalacao = event.target.value;
  // Alguns navegadores restringem mudanças de URL no protocolo file:.
  if (location.protocol !== 'file:') history.replaceState(null, '', url('contas'));
  render();
});
document.querySelector('dialog').addEventListener('close', () => ultimoFoco?.focus());
carregar();

})();
