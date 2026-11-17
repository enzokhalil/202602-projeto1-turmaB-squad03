'use strict';
// O conteúdo de cada tela está no HTML. Este arquivo controla apenas a interface.
(() => {
  const viewport = document.querySelector('#viewport');
  const header = document.querySelector('#compact-header');
  const headerButton = header.querySelector('button');
  const avatar = header.querySelector('.header-avatar');
  const menu = document.querySelector('#menu');
  const notice = document.querySelector('#notice');
  const internal = document.body.dataset.internal === 'true';
  const notices = {
  "pix": [
    "Pagamento de demonstração",
    "O protótipo permite consultar a fatura, mas não gera Pix nem realiza pagamentos."
  ],
  "boleto": [
    "Boleto de demonstração",
    "Nenhum boleto real é emitido neste protótipo."
  ],
  "contrato": [
    "Documento ainda não disponível",
    "O contrato não está anexado ao protótipo. A interface orienta solicitar o documento ao atendimento."
  ],
  "canais": [
    "Canal de demonstração",
    "Esta ação ilustra o acesso ao atendimento. Não envia mensagens nem liga para números reais."
  ],
  "consulta": [
    "Consulta indisponível",
    "O pedido continua registrado. Neste cenário demonstrativo, o andamento não está disponível."
  ]
};
  let collapsed = false;
  let startX = 0;

  function updateHeader() {
    // Uma animação completa, sem parar na metade quando a rolagem para.
    collapsed = viewport.scrollTop >= (collapsed ? 24 : 56);
    const progress = collapsed ? 1 : 0;
    header.style.setProperty('--logo-x', (startX * (1 - progress)) + 'px');
    header.style.setProperty('--header-y', (3 * (1 - progress)) + 'px');
    header.style.setProperty('--header-height', (70 - 6 * progress) + 'px');
    header.style.setProperty('--header-shadow', (progress * .12).toFixed(3));
    header.style.setProperty('--menu-opacity', internal ? 0 : 1 - progress);
    header.style.setProperty('--back-opacity', internal ? 1 : progress);
    header.style.setProperty('--avatar-opacity', internal ? 0 : 1 - progress);
    const back = internal || collapsed;
    headerButton.toggleAttribute('data-back', back);
    headerButton.toggleAttribute('data-menu', !back);
    headerButton.setAttribute('aria-label', back ? 'Voltar' : 'Abrir menu');
    avatar.setAttribute('aria-hidden', String(back));
  }

  function measureHeader() {
    const originalLeft = viewport.clientWidth / 2 - 51.5;
    const targetLeft = viewport.clientWidth - 23 - 99;
    startX = internal ? 0 : originalLeft - targetLeft;
    updateHeader();
  }

  function goBack() {
    // Use o histórico somente quando a origem também for uma tela deste fluxo.
    if (document.referrer) {
      const previous = new URL(document.referrer);
      if (previous.origin === location.origin && /\/hu0[1-6]-v2-/.test(previous.pathname)
          && previous.href !== location.href) {
        history.back();
        return;
      }
    }
    const fallback = document.body.dataset.back;
    if (location.pathname.endsWith('/' + fallback)) menu.showModal();
    else location.href = fallback;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-menu')) menu.showModal();
    if (button.hasAttribute('data-close')) button.closest('dialog').close();
    if (button.hasAttribute('data-back')) goBack();
    if (button.dataset.notice && notices[button.dataset.notice]) {
      const [title, copy] = notices[button.dataset.notice];
      document.querySelector('#notice-title').textContent = title;
      document.querySelector('#notice-copy').textContent = copy;
      notice.showModal();
    }
  });
  viewport.addEventListener('scroll', updateHeader, {passive: true});
  window.addEventListener('resize', measureHeader);
  window.addEventListener('pageshow', measureHeader);
  measureHeader();
})();