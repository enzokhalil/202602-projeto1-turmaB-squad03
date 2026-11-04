const asset = (name) => new URL(`../img/app-template/${name}`, import.meta.url).href;
const stylesheet = new URL('../css/app-template.css', import.meta.url).href;
const fontStylesheet = new URL('../css/app-fonts.css', import.meta.url).href;
if (!document.querySelector(`link[href="${fontStylesheet}"]`)) {
  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = fontStylesheet;
  document.head.append(fonts);
}

const areas = [
  { id: 'faturas', label: 'Minhas contas', description: 'Fatura atual e histórico', icon: 'faturas.svg', tab: 'Faturas' },
  { id: 'economia', label: 'Minha economia', description: 'Resultado, cálculo e evolução', icon: 'economia.svg', tab: 'Economia', tabIcon: 'tab-economia.svg', chevron: 'chevron-green.svg' },
  { id: 'contrato', label: 'Minha contratação', description: 'Condições e documento', icon: 'contrato.svg', tab: 'Contrato', tabIcon: 'tab-contrato.svg', chevron: 'chevron-purple.svg' },
  { id: 'servico', label: 'Como funciona a Bulbe', description: 'Explicação do serviço', icon: 'servico.svg' },
  { id: 'duas-contas', label: 'Entenda suas contas', description: 'Cobranças Bulbe e distribuidora', icon: 'duas-contas.svg' },
  { id: 'ajuda', label: 'Atendimento', description: 'Contato, protocolo e cancelamento', icon: 'ajuda.svg', tab: 'Ajuda', tabIcon: 'tab-ajuda.svg', chevron: 'chevron-teal.svg' },
  { id: 'indicacoes', label: 'Indique e ganhe', description: 'Compartilhe a Bulbe com amigos', icon: 'indicacoes.svg', chevron: 'chevron-green.svg' },
];

const brand = `<span class="brand" role="img" aria-label="Bulbe">
  <img class="brand__letters" src="${asset('logo-original.png')}" alt="">
  <img class="brand__rays" src="${asset('logo-original.png')}" alt="">
</span>`;

export class BulbeApp extends HTMLElement {
  static observedAttributes = ['section-label', 'page-title', 'subtitle', 'greeting', 'installation', 'profile-initial', 'active-area'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesheet}">
      <div class="app-page">
        <header class="app-header">
          <img class="header-sun" src="${asset('header-sun.svg')}" alt="">
          <div class="topbar">
            <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="app-menu" aria-expanded="false">
              <img src="${asset('menu.svg')}" alt="">
            </button>
            ${brand}
            <span class="profile" aria-label="Perfil de demonstração"></span>
          </div>
          <div class="header-copy">
            <p class="section-label" data-copy="section-label"></p>
            <h1 data-copy="page-title"></h1>
            <p class="subtitle" data-copy="subtitle"></p>
            <p class="greeting" data-copy="greeting"></p>
            <select class="installation" aria-label="Instalação"><option></option></select>
          </div>
        </header>
        <main id="app-content" tabindex="-1"><slot></slot></main>
        <nav class="bottom-nav" aria-label="Navegação principal">
          ${areas.filter((area) => area.tab).map((area) => `
            <button class="tab" type="button" data-area="${area.id}" aria-pressed="false">
              <span class="icon" aria-hidden="true" style="--icon: url('${asset(area.tabIcon || area.icon)}')"></span>
              <span>${area.tab}</span>
            </button>`).join('')}
        </nav>
      </div>
      <div class="menu-layer" id="app-menu" role="dialog" aria-modal="true" aria-labelledby="menu-heading" hidden>
        <div class="drawer">
          <header class="drawer-header">
            <img class="header-sun" src="${asset('drawer-sun.svg')}" alt="">
            ${brand}
            <p class="section-label">TODAS AS ÁREAS</p>
            <h2 id="menu-heading">Menu</h2>
            <p>Escolha para onde ir.</p>
            <button class="close-menu" type="button" aria-label="Fechar menu"><img src="${asset('close.svg')}" alt=""></button>
          </header>
          <nav class="drawer-nav" aria-label="Todas as áreas">
            ${areas.map((area) => `
              <button class="drawer-link" type="button" data-area="${area.id}">
                <span class="drawer-link__icon"><img class="icon" src="${asset(area.icon)}" alt=""></span>
                <span class="drawer-link__text"><strong>${area.label}</strong><small>${area.description}</small></span>
                <img class="drawer-link__chevron" src="${asset(area.chevron || 'chevron.svg')}" alt="">
              </button>`).join('')}
          </nav>
        </div>
      </div>`;
    this.page = this.shadowRoot.querySelector('.app-page');
    this.menu = this.shadowRoot.querySelector('.menu-layer');
    this.toggle = this.shadowRoot.querySelector('.menu-toggle');
    this.closeButton = this.shadowRoot.querySelector('.close-menu');
    this.toggle.addEventListener('click', () => this.openMenu());
    this.closeButton.addEventListener('click', () => this.closeMenu());
    this.menu.addEventListener('click', (event) => {
      if (event.target === this.menu) this.closeMenu();
    });
    this.shadowRoot.addEventListener('click', (event) => {
      const button = event.target.closest('[data-area]');
      if (!button) return;
      const area = button.dataset.area;
      this.setAttribute('active-area', area);
      this.closeMenu();
      this.dispatchEvent(new CustomEvent('bulbe:navigate', { detail: { area }, bubbles: true, composed: true }));
    });
    this.menu.addEventListener('keydown', (event) => this.handleMenuKey(event));
    this.shadowRoot.querySelector('.installation').addEventListener('change', (event) => {
      this.setAttribute('installation', event.target.value);
      this.dispatchEvent(new CustomEvent('bulbe:installation-change', { detail: { installation: event.target.value }, bubbles: true, composed: true }));
    });
  }

  connectedCallback() { this.update(); }
  attributeChangedCallback() { if (this.page) this.update(); }

  update() {
    const defaults = { 'section-label': 'VISÃO GERAL', 'page-title': 'Minhas contas', subtitle: 'Valores, vencimentos e pagamentos', greeting: 'Marina, sua próxima conta está aqui.' };
    for (const element of this.shadowRoot.querySelectorAll('[data-copy]')) {
      const key = element.dataset.copy;
      element.textContent = this.getAttribute(key) ?? defaults[key];
      element.hidden = element.textContent === '';
    }
    this.shadowRoot.querySelector('.profile').textContent = this.getAttribute('profile-initial') || 'M';
    const installation = this.getAttribute('installation') || '3013588579';
    const option = this.shadowRoot.querySelector('.installation option');
    option.value = installation;
    option.textContent = `Instalação ${installation}`;
    const active = this.getAttribute('active-area') || 'faturas';
    const tabArea = active === 'duas-contas' ? 'faturas' : active;
    for (const button of this.shadowRoot.querySelectorAll('.tab')) {
      button.setAttribute('aria-pressed', String(button.dataset.area === tabArea));
    }
    for (const button of this.shadowRoot.querySelectorAll('.drawer-link')) {
      if (button.dataset.area === active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  }

  openMenu() {
    this.menu.hidden = false;
    this.page.inert = true;
    this.toggle.setAttribute('aria-expanded', 'true');
    this.closeButton.focus();
  }

  closeMenu() {
    if (this.menu.hidden) return;
    this.menu.hidden = true;
    this.page.inert = false;
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.focus();
  }

  handleMenuKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
    }
    if (event.key !== 'Tab') return;
    const buttons = [...this.menu.querySelectorAll('button')];
    const first = buttons[0];
    const last = buttons.at(-1);
    const current = this.shadowRoot.activeElement;
    if (event.shiftKey && current === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault(); first.focus();
    }
  }
}

if (!customElements.get('bulbe-app')) customElements.define('bulbe-app', BulbeApp);
