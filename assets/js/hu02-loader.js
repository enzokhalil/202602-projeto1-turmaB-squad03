// O template e a demonstração podem abrir por duplo clique.
// Com servidor, a HU02 continua usando api.js e fetch dos arquivos JSON.
(() => {
  const base = document.currentScript.src;
  function falha() {
    const content = document.querySelector('#conteudo-contas');
    content.setAttribute('aria-busy', 'false');
    content.innerHTML = '<div class="hu02-card hu02-feedback"><h2>Não foi possível abrir as contas</h2><p>Extraia a pasta completa do ZIP e mantenha as pastas assets, data e pages juntas.</p><button class="hu02-button" type="button">Tentar novamente</button></div>';
    content.querySelector('button').addEventListener('click', () => location.reload());
  }
  if (location.protocol === 'file:') {
    const demo = document.createElement('script');
    demo.src = new URL('hu02-offline.js', base).href;
    demo.addEventListener('error', falha);
    document.head.append(demo);
  } else {
    import(new URL('hu02.js', base).href).catch(falha);
  }
})();
