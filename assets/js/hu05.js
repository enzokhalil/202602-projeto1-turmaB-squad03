// leva até o detalhe da Cemig
document.querySelector('#ver-cemig').addEventListener('click', () => {
  const detalhe = document.querySelector('#detalhe-cemig');
  detalhe.scrollIntoView({ behavior: 'smooth', block: 'start' });
  detalhe.focus({ preventScroll: true });
});
