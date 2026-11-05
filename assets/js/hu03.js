// Conteúdo da HU03: Minha contratação e Meu documento.
// Script clássico (defer) para funcionar também por duplo clique no protocolo file:.
// Com servidor, os dados vêm de data/contratacao.json; sem servidor, usa a cópia embutida.
(() => {
  // Cópia de demonstração, idêntica a data/contratacao.json, para abrir sem servidor.
  const DEMO = {
    clienteId: 1,
    nome: 'Marina Souza',
    instalacoes: [
      {
        instalacao: '3013588579',
        adesao: '2026-000123',
        dataAdesao: '2026-09-20',
        descontoPercentual: 15,
        beneficioAtivo: true,
        inicioServico: '2026-10-01',
        permanenciaMinima: null,
        prazoCancelamento: null,
        multa: null,
        primeiraReferencia: '2026-10',
        primeiraFaturaVencimento: '2026-11-12',
        eventos: [
          { data: '2026-09-20', descricao: 'Adesão registrada' },
          { data: '2026-09-22', descricao: 'Análise iniciada' },
          { data: '2026-10-01', descricao: 'Instalação conectada' },
        ],
      },
    ],
  };

  const scriptUrl = document.currentScript ? document.currentScript.src : location.href;
  const app = document.querySelector('bulbe-app');
  const conteudo = document.querySelector('#hu03-conteudo');
  const tela = document.body.dataset.hu03Tela; // 'contratacao' ou 'documento'
  const params = new URLSearchParams(location.search);
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  let dados = DEMO;
  let instalacao = params.get('instalacao') || '';
  let ultimoFoco;

  const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dataBR = (iso) => { const [a, m, d] = iso.split('-'); return `${d}/${m}/${a}`; };
  const diaMes = (iso) => { const [, m, d] = iso.split('-'); return `${d}/${m}`; };
  const refMesAno = (iso) => { const [a, m] = iso.split('-'); return `${meses[Number(m) - 1]}/${a}`; };
  const indisponivel = (valor) => (valor == null || valor === '' ? null : valor);

  // Ícones em linha, mesmo traço dos SVGs do template.
  const iconeDoc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>';
  const iconeInfo = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  const iconeFone = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z"/><path d="M20 17v1a3 3 0 0 1-3 3h-2"/></svg>';
  const chevron = '<svg class="hu03-action__chevron" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m2 2 6 6-6 6"/></svg>';

  function withQuery(pagina) {
    const query = new URLSearchParams();
    if (instalacao) query.set('instalacao', instalacao);
    const sufixo = query.toString();
    return sufixo ? `${pagina}?${sufixo}` : pagina;
  }

  function acao({ titulo, texto, icon, href, scroll, dialog, teal }) {
    const tag = href ? 'a' : 'button';
    const attr = href ? `href="${escapar(href)}"` : `type="button"${scroll ? ` data-scroll="${scroll}"` : ''}${dialog ? ` data-dialog="${dialog}"` : ''}`;
    return `<${tag} class="hu03-action${teal ? ' hu03-action--teal' : ''}" ${attr}>
      <span class="hu03-action__icon">${icon}</span>
      <span class="hu03-action__copy"><strong>${escapar(titulo)}</strong><small>${escapar(texto)}</small></span>${chevron}</${tag}>`;
  }

  function linha(rotulo, valor, naoInformado) {
    const texto = valor == null ? naoInformado : valor;
    return `<div><dt>${escapar(rotulo)}</dt><dd${valor == null ? ' class="hu03-indisponivel"' : ''}>${escapar(texto)}</dd></div>`;
  }

  function mensagem(titulo, texto) {
    conteudo.innerHTML = `<div class="hu03-card hu03-feedback"><h2>${escapar(titulo)}</h2><p>${escapar(texto)}</p></div>
      ${acao({ titulo: 'Falar com o atendimento', texto: 'Tirar dúvidas sobre a contratação', icon: iconeFone, dialog: 'reconheço', teal: true })}`;
  }

  function contratoAtual() {
    const lista = dados.instalacoes || [];
    return lista.find((c) => c.instalacao === instalacao) || lista[0] || null;
  }

  function renderContratacao(c) {
    const saudacao = document.querySelector('#hu03-saudacao');
    if (saudacao) saudacao.textContent = `${dados.nome.split(' ')[0]}, acompanhe sua contratação.`;
    conteudo.innerHTML = `
      <article class="hu03-card hu03-card--cream">
        <h2 class="hu03-accent">Contratação ativa</h2>
        <dl class="hu03-rows">
          ${linha('Adesão', c.adesao)}
          ${linha('Data', dataBR(c.dataAdesao))}
          ${linha('Instalação', c.instalacao)}
        </dl>
        ${c.descontoPercentual != null ? `<span class="hu03-benefit">${c.descontoPercentual}% sobre a energia elegível</span>` : ''}
      </article>

      ${acao({ titulo: 'Documento da contratação', texto: 'Consultar a cópia disponível', icon: iconeDoc, href: withQuery('hu03-documento.html') })}
      ${acao({ titulo: 'Condições e cancelamento', texto: 'Veja o que está registrado', icon: iconeInfo, scroll: 'hu03-condicoes' })}
      ${acao({ titulo: 'Não reconheço esta adesão', texto: 'Pedir esclarecimento ao atendimento', icon: iconeFone, dialog: 'reconheço', teal: true })}

      <section class="hu03-card">
        <h2>Ativação e primeira cobrança</h2>
        ${c.beneficioAtivo ? '<span class="hu03-tag hu03-tag--green hu03-tag--block">Benefício ativo neste exemplo</span>' : ''}
        <ul class="hu03-timeline">
          ${(c.eventos || []).map((e) => `<li><b>${diaMes(e.data)}</b> • ${escapar(e.descricao)}</li>`).join('')}
        </ul>
        ${c.primeiraReferencia && c.primeiraFaturaVencimento ? `<p class="hu03-text">Primeira referência: ${refMesAno(c.primeiraReferencia)}. Cobrança Bulbe disponível com vencimento em ${dataBR(c.primeiraFaturaVencimento)}.</p>` : ''}
        <a class="hu03-link" href="hu02-contas.html?cliente=${dados.clienteId}">Consultar a primeira fatura →</a>
      </section>

      <section class="hu03-card" id="hu03-condicoes">
        <h2 class="hu03-accent">Condições registradas</h2>
        <dl class="hu03-rows">
          ${linha('Início do serviço', c.inicioServico ? dataBR(c.inicioServico) : null, 'Não informado')}
          ${linha('Permanência mínima', indisponivel(c.permanenciaMinima), 'Não informada')}
          ${linha('Prazo de cancelamento', indisponivel(c.prazoCancelamento), 'Não informado')}
          ${linha('Multa', indisponivel(c.multa), 'Não informada')}
        </dl>
        <p class="hu03-note">Um campo não informado não significa isenção ou ausência de condições. Confira o documento e fale com a equipe.</p>
      </section>

      <div class="hu03-links">
        <a class="hu03-link" href="hu06-bulbe-mapa.html#/cancelar">Como solicitar cancelamento →</a>
        <a class="hu03-link" href="hu04.html#/servico">Entender como a Bulbe funciona →</a>
      </div>

      <footer class="hu03-demo"><span>Demonstração · dados fictícios</span><a href="../../index.html">Início do projeto ↗</a></footer>`;
  }

  function renderDocumento(c) {
    const sub = document.querySelector('#hu03-doc-sub');
    if (sub) sub.textContent = `Adesão ${c.adesao} • exemplo ilustrativo.`;
    conteudo.innerHTML = `
      <article class="hu03-card hu03-card--cream">
        <h2 class="hu03-accent">Documento da contratação</h2>
        <span class="hu03-tag hu03-tag--lavender hu03-tag--block">Demonstração • sem validade contratual</span>
        <dl class="hu03-rows">
          ${linha('Adesão', dataBR(c.dataAdesao))}
          ${linha('Instalação', c.instalacao)}
        </dl>
        ${c.descontoPercentual != null ? `<p class="hu03-text">Benefício ilustrativo: ${c.descontoPercentual}% sobre a energia elegível.</p>` : ''}
        <p class="hu03-text">Esta visualização representa o acesso ao documento. Para conferir cláusulas, solicite a cópia oficial assinada. Não acrescentamos condições contratuais ausentes.</p>
      </article>

      <a class="hu03-button" href="hu06-bulbe-mapa.html#/atendimento?ir=canais">Pedir a cópia ao atendimento</a>
      <a class="hu03-link" href="${escapar(withQuery('hu03-contratacao.html'))}">Voltar à minha contratação →</a>

      <footer class="hu03-demo"><span>Demonstração · dados fictícios</span><a href="../../index.html">Início do projeto ↗</a></footer>`;
  }

  function render() {
    const c = contratoAtual();
    if (!c) { mensagem('Contratação não encontrada', 'Não há uma contratação disponível para esta instalação nos dados de demonstração.'); return; }
    if (tela === 'documento') renderDocumento(c);
    else renderContratacao(c);
    conteudo.setAttribute('aria-busy', 'false');
  }

  function montarSeletor() {
    const label = document.querySelector('#hu03-instalacao-label');
    const select = document.querySelector('#hu03-instalacao');
    if (!label || !select) return;
    const instalacoes = (dados.instalacoes || []).map((c) => c.instalacao).filter(Boolean);
    if (!instalacoes.length) { label.hidden = true; return; }
    if (!instalacao || !instalacoes.includes(instalacao)) instalacao = instalacoes[0];
    select.innerHTML = instalacoes.map((i) => `<option value="${escapar(i)}">Instalação ${escapar(i)}</option>`).join('');
    select.value = instalacao;
    label.hidden = false;
  }

  async function carregar() {
    if (location.protocol !== 'file:') {
      try {
        const base = new URL('../../data/', scriptUrl);
        const resposta = await fetch(new URL('contratacao.json', base));
        if (resposta.ok) dados = await resposta.json();
      } catch (_) {
        // Sem servidor ou arquivo ausente: mantém a cópia de demonstração embutida.
      }
    }
    if (app) app.setAttribute('profile-initial', (dados.nome || 'M')[0]);
    montarSeletor();
    render();
  }

  // Textos dos diálogos. Apenas orientação; nada é efetivado nesta demonstração.
  const dialogos = {
    reconheço: ['Não reconhece esta adesão?', 'Se você não reconhece esta contratação, procure o atendimento da Bulbe para esclarecer o vínculo. Esta é uma demonstração acadêmica: não há canal real conectado nem abertura de solicitação.'],
  };

  function dialogo(chave) {
    const dialog = document.querySelector('.hu03-dialog');
    const [titulo, texto] = dialogos[chave] || ['Outra área', 'Esta área será conectada à tela do integrante responsável quando estiver disponível.'];
    ultimoFoco = document.activeElement;
    document.querySelector('#hu03-dialogo-titulo').textContent = titulo;
    document.querySelector('#hu03-dialogo-texto').textContent = texto;
    dialog.showModal();
  }

  document.addEventListener('click', (event) => {
    const alvo = event.target.closest('[data-dialog], [data-scroll]');
    if (!alvo) return;
    if (alvo.dataset.dialog) { event.preventDefault(); dialogo(alvo.dataset.dialog); return; }
    if (alvo.dataset.scroll) {
      const destino = document.getElementById(alvo.dataset.scroll);
      if (destino) { event.preventDefault(); destino.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });

  document.querySelector('.hu03-dialog')?.addEventListener('close', () => ultimoFoco?.focus());
  document.querySelector('#hu03-instalacao')?.addEventListener('change', (event) => {
    instalacao = event.target.value;
    if (location.protocol !== 'file:') history.replaceState(null, '', withQuery(location.pathname.split('/').pop()));
    render();
  });

  carregar();
})();
