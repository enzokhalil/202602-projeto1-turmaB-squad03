(() => {
if (customElements.get('bulbe-app')) return;
const scriptUrl = document.currentScript.src;
const asset = (name) => new URL(`../img/app-template/${name}`, scriptUrl).href;
const stylesheet = new URL('../css/app-template.css', scriptUrl).href;
const fontStylesheet = new URL('../css/app-fonts.css', scriptUrl).href;
if (!document.querySelector(`link[href="${fontStylesheet}"]`)) {
  const fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = fontStylesheet;
  document.head.append(fonts);
}

const areas = [
  { id: 'faturas', route: 'hu02-contas.html', label: 'Minhas contas', description: 'Fatura atual e histórico', icon: 'faturas.svg', tab: 'Faturas' },
  { id: 'economia', route: 'hu01-minha-economia.html', label: 'Minha economia', description: 'Resultado, cálculo e evolução', icon: 'economia.svg', tab: 'Economia', tabIcon: 'tab-economia.svg', chevron: 'chevron-green.svg' },
  { id: 'contrato', route: 'hu03-contratacao.html', label: 'Minha contratação', description: 'Condições e documento', icon: 'contrato.svg', tab: 'Contrato', tabIcon: 'tab-contrato.svg', chevron: 'chevron-purple.svg' },
  { id: 'servico', route: 'hu04.html#/servico', label: 'Como funciona a Bulbe', description: 'Explicação do serviço', icon: 'servico.svg' },
  { id: 'duas-contas', route: 'hu05-entenda-suas-contas.html', label: 'Entenda suas contas', description: 'Cobranças Bulbe e distribuidora', icon: 'duas-contas.svg' },
  { id: 'ajuda', route: 'hu06-bulbe-mapa.html#/atendimento', label: 'Atendimento', description: 'Contato, protocolo e cancelamento', icon: 'ajuda.svg', tab: 'Ajuda', tabIcon: 'tab-ajuda.svg', chevron: 'chevron-teal.svg' },
];

const brand = `<span class="brand" role="img" aria-label="Bulbe">
  <img class="brand__letters" src="${asset('logo-original.png')}" alt="">
  <img class="brand__rays" src="${asset('logo-original.png')}" alt="">
</span>`;

class BulbeApp extends HTMLElement {
  static observedAttributes = ['profile-initial', 'active-area'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesheet}">
      <div class="app-page">
        <header class="app-header">
          <div class="topbar">
            <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-controls="app-menu" aria-expanded="false">
              <img src="${asset('menu.svg')}" alt="">
            </button>
            ${brand}
            <span class="profile" aria-label="Perfil de demonstração"></span>
          </div>
        </header>
        <main id="app-content" tabindex="-1"><slot></slot></main>
        <nav class="bottom-nav" aria-label="Navegação principal">
          ${areas.filter((area) => area.tab).map((area) => `
            <button class="tab" type="button" data-area="${area.id}" aria-pressed="false">
              <img class="icon" src="${asset(area.tabIcon || area.icon)}" alt="">
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
      this.closeMenu();
      const navigate = this.dispatchEvent(new CustomEvent('bulbe:navigate', {
        detail: { area }, bubbles: true, composed: true, cancelable: true,
      }));
      if (navigate) this.navigate(area);
    });
    this.menu.addEventListener('keydown', (event) => this.handleMenuKey(event));
  }

  connectedCallback() { this.update(); }
  attributeChangedCallback() { if (this.page) this.update(); }

  update() {
    this.shadowRoot.querySelector('.profile').textContent = this.getAttribute('profile-initial') || 'M';
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

  navigate(area, search = location.search) {
    const route = areas.find((entry) => entry.id === area).route;
    const destination = new URL(`../telas/${route}`, scriptUrl);
    const current = new URLSearchParams(search);
    for (const key of ['cliente', 'instalacao']) {
      if (current.has(key)) destination.searchParams.set(key, current.get(key));
    }
    if (destination.href !== location.href) location.assign(destination.href);
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
})();
