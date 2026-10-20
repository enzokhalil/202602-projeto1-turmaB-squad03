import {
  buscarClientes,
  buscarCanais,
  buscarAssuntos,
  buscarCancelamento,
  buscarSolicitacoesDoCliente
} from './api.js';

// Rótulos exibidos para cada situação. A situação vem do dado; nada é inventado aqui.
const SITUACOES = {
  registrada: 'Registrada',
  em_analise: 'Em análise',
  aguardando_cliente: 'Aguardando você',
  concluida: 'Concluída'
};

const estado = {
  canais: [],
  assuntos: [],
  clientes: [],
  cancelamento: null,
  assuntoAtual: null,
  clienteAtual: null
};

// ---------- utilidades ----------

function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function normalizar(texto) {
  return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function formatarData(iso) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR');
}

function canalPorId(id) {
  return estado.canais.find((c) => c.id === id);
}

function canalPreferido() {
  return estado.clienteAtual?.canalPreferido ?? null;
}

// ---------- assuntos e canal adequado ----------

function renderAssuntos() {
  const area = document.querySelector('#assuntos');
  area.innerHTML = estado.assuntos
    .map((a) => `<button type="button" class="chip" data-assunto="${esc(a.id)}" aria-pressed="${estado.assuntoAtual?.id === a.id}">${esc(a.titulo)}</button>`)
    .join('');
}

function acharAssunto(termo) {
  const t = normalizar(termo);
  if (t.length < 3) return null;
  return estado.assuntos.find((a) =>
    a.palavrasChave.some((p) => {
      const k = normalizar(p);
      return k.includes(t) || t.includes(k);
    })
  ) ?? null;
}

function htmlCanalResumo(canal) {
  const preferido = canal.id === canalPreferido() ? '<span class="selo">Seu canal preferido</span>' : '';
  return `
    <li class="canal-resumo">
      <strong>${esc(canal.nome)}</strong> ${preferido}
      <span class="contato">${esc(canal.contato)}</span>
      <span class="horario">${esc(canal.horario)}</span>
    </li>`;
}

function htmlCancelamento() {
  const c = estado.cancelamento;
  if (!c) return '';
  const responsavel = canalPorId(c.canalResponsavel);
  const alternativos = c.canaisAlternativos.map((id) => canalPorId(id)?.nome).filter(Boolean);
  return `
    <article class="cancelamento">
      <h3>Como cancelar</h3>
      <p><strong>Canal responsável:</strong> ${esc(responsavel?.nome ?? c.canalResponsavel)}${responsavel ? ` · ${esc(responsavel.contato)}` : ''}${alternativos.length ? `. Também pelo ${esc(alternativos.join(', '))}.` : '.'}</p>
      <ol>${c.passos.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      <ul class="avisos">${c.avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
      ${c.confirmarComBulbe ? '<p class="nota">Texto de exemplo do protótipo. O procedimento real deve ser confirmado com a Bulbe.</p>' : ''}
    </article>`;
}

function renderResultadoAssunto(mensagemVazia = '') {
  const area = document.querySelector('#resultado-assunto');
  const a = estado.assuntoAtual;

  if (!a) {
    area.innerHTML = mensagemVazia ? `<p class="vazio">${esc(mensagemVazia)}</p>` : '';
    renderCanais();
    return;
  }

  const recomendados = a.canais.map(canalPorId).filter(Boolean);
  area.innerHTML = `
    <h3>${esc(a.titulo)}</h3>
    <p>${esc(a.orientacao)}</p>
    <p class="rotulo">Canais indicados:</p>
    <ul class="canais-resumo">${recomendados.map(htmlCanalResumo).join('')}</ul>
    ${a.mostrarCancelamento ? htmlCancelamento() : ''}`;
  renderCanais();
}

function selecionarAssunto(assunto) {
  estado.assuntoAtual = assunto;
  renderAssuntos();
  renderResultadoAssunto();
}

// ---------- canais ----------

function renderCanais() {
  const indicados = estado.assuntoAtual?.canais ?? [];
  document.querySelector('#canais').innerHTML = estado.canais
    .map((c) => `
      <article class="cartao canal${indicados.includes(c.id) ? ' indicado' : ''}">
        <h3>${esc(c.nome)} ${indicados.includes(c.id) ? '<span class="selo">Indicado para o seu assunto</span>' : ''}</h3>
        <p class="tipo">${esc(c.tipo)}</p>
        <p>${esc(c.descricao)}</p>
        <p class="contato"><strong>${esc(c.contato)}</strong></p>
        <p class="horario">${esc(c.horario)}</p>
        <p class="protocolo-info">${c.geraProtocolo ? 'Gera número de protocolo.' : 'Não gera protocolo.'}</p>
        <details>
          <summary>Como usar</summary>
          <ol>${c.comoUsar.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
        </details>
      </article>`)
    .join('');
}

// ---------- solicitações ----------

function htmlProtocolo(s) {
  if (!s.protocolo) {
    return `<div class="protocolo sem"><span class="rotulo">Protocolo</span>
      <p>Esta solicitação não tem protocolo registrado no sistema.</p></div>`;
  }
  return `<div class="protocolo"><span class="rotulo">Protocolo</span>
    <code class="numero-protocolo">${esc(s.protocolo)}</code>
    <button type="button" class="botao-copiar" data-copiar="${esc(s.protocolo)}">Copiar protocolo</button></div>`;
}

function htmlAndamento(s) {
  const canal = canalPorId(s.canal);
  const nomeCanal = canal?.nome ?? s.canal;

  const linhas = [
    `<li><span>Aberta em</span> ${esc(formatarData(s.abertaEm))} pelo ${esc(nomeCanal)}</li>`,
    `<li><span>Última atualização</span> ${s.atualizadoEm ? esc(formatarData(s.atualizadoEm)) : 'Sem atualizações registradas'}</li>`,
    `<li><span>Prazo</span> ${s.prazoInformado ? esc(formatarData(s.prazoInformado)) : 'Não informado'}</li>`
  ].join('');

  let aviso = '';
  if (!s.consultavelNoSistema) {
    const referencia = s.protocolo ? `informando o protocolo ${esc(s.protocolo)}` : `informando a data do pedido (${esc(formatarData(s.abertaEm))})`;
    aviso = `<p class="alerta">Não é possível consultar o andamento desta solicitação por aqui. Para saber como ela está, fale com o canal ${esc(nomeCanal)} ${referencia}.</p>`;
  }

  const historico = s.historico?.length
    ? `<details open><summary>Histórico</summary><ul class="historico">${s.historico.map((h) => `<li><span>${esc(formatarData(h.data))}</span> ${esc(h.descricao)}</li>`).join('')}</ul></details>`
    : '';

  return `<ul class="meta">${linhas}</ul>${aviso}${historico}`;
}

function htmlSolicitacao(s) {
  return `
    <article class="cartao solicitacao">
      <header>
        <h3>${esc(s.tipo)}</h3>
        <span class="situacao situacao-${esc(s.situacao)}">${esc(SITUACOES[s.situacao] ?? s.situacao)}</span>
      </header>
      ${htmlProtocolo(s)}
      ${htmlAndamento(s)}
    </article>`;
}

function htmlSemSolicitacoes() {
  const preferido = canalPorId(canalPreferido()) ?? canalPorId('whatsapp');
  return `
    <div class="vazio">
      <h3>Você não tem solicitações registradas</h3>
      <p>Para abrir uma, escolha seu assunto na parte de cima da página ou fale com o atendimento.</p>
      ${preferido ? `<p><strong>${esc(preferido.nome)}:</strong> ${esc(preferido.contato)} · ${esc(preferido.horario)}</p>` : ''}
      <p>Ao ser atendido, peça e anote o número de protocolo.</p>
    </div>`;
}

async function renderSolicitacoes() {
  const area = document.querySelector('#solicitacoes');
  try {
    const lista = await buscarSolicitacoesDoCliente(estado.clienteAtual.id);
    area.innerHTML = lista.length ? lista.map(htmlSolicitacao).join('') : htmlSemSolicitacoes();
  } catch (erro) {
    area.innerHTML = '<p class="alerta">Não foi possível carregar suas solicitações agora. Tente de novo ou fale com um dos canais acima.</p>';
    console.error(erro);
  }
}

// ---------- eventos ----------

async function copiar(botao) {
  const texto = botao.dataset.copiar;
  const original = botao.textContent;
  try {
    await navigator.clipboard.writeText(texto);
    botao.textContent = 'Protocolo copiado';
  } catch {
    botao.textContent = 'Copie manualmente';
  }
  setTimeout(() => { botao.textContent = original; }, 2000);
}

function ligarEventos() {
  document.querySelector('#assuntos').addEventListener('click', (e) => {
    const botao = e.target.closest('[data-assunto]');
    if (!botao) return;
    document.querySelector('#busca').value = '';
    selecionarAssunto(estado.assuntos.find((a) => a.id === botao.dataset.assunto));
  });

  document.querySelector('#busca').addEventListener('input', (e) => {
    const termo = e.target.value;
    if (normalizar(termo).length < 3) {
      selecionarAssunto(null);
      return;
    }
    const achado = acharAssunto(termo);
    estado.assuntoAtual = achado;
    renderAssuntos();
    renderResultadoAssunto(achado ? '' : 'Não encontramos esse assunto. Escolha uma das opções acima ou veja todos os canais logo abaixo.');
  });

  document.querySelector('#solicitacoes').addEventListener('click', (e) => {
    const botao = e.target.closest('[data-copiar]');
    if (botao) copiar(botao);
  });

  document.querySelector('#cliente').addEventListener('change', (e) => {
    estado.clienteAtual = estado.clientes.find((c) => String(c.id) === e.target.value);
    renderResultadoAssunto();
    renderSolicitacoes();
  });
}

async function iniciar() {
  try {
    const [canais, assuntos, clientes, cancelamento] = await Promise.all([
      buscarCanais(), buscarAssuntos(), buscarClientes(), buscarCancelamento()
    ]);
    Object.assign(estado, { canais, assuntos, clientes, cancelamento, clienteAtual: clientes[0] });
  } catch (erro) {
    document.querySelector('main').insertAdjacentHTML('afterbegin',
      '<p class="alerta">Não foi possível carregar os dados. O projeto está aberto pelo Live Server?</p>');
    console.error(erro);
    return;
  }

  document.querySelector('#cliente').innerHTML = estado.clientes
    .map((c) => `<option value="${esc(c.id)}">${esc(c.nome)}</option>`)
    .join('');

  renderAssuntos();
  renderResultadoAssunto();
  ligarEventos();
  await renderSolicitacoes();
}

iniciar();
