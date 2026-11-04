// Regras da HU02, separadas da apresentação para permitir testes.
export function situacao(fatura, hoje = new Date()) {
  if (fatura.status === 'paga') return 'paga';
  if (fatura.status === 'prevista') return 'prevista';
  const data = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  return fatura.status === 'vencida' || fatura.vencimento < data ? 'vencida' : 'aberta';
}

export function ordenarContas(contas) {
  return [...contas].sort((a, b) => b.referencia.localeCompare(a.referencia) || b.id - a.id);
}

export function proximaConta(contas, hoje = new Date()) {
  const emitidas = contas.filter((f) => ['aberta', 'vencida'].includes(situacao(f, hoje)));
  return [...emitidas].sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0]
    || ordenarContas(contas.filter((f) => situacao(f, hoje) === 'prevista'))[0]
    || ordenarContas(contas)[0];
}

export const moeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
export const dataCurta = (valor) => valor.split('-').reverse().slice(0, 2).join('/');
export const dataCompleta = (valor) => valor.split('-').reverse().join('/');
export function referencia(valor, curta = false) {
  const [ano, mes] = valor.split('-').map(Number);
  const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(ano, mes - 1, 1));
  return `${nome[0].toUpperCase()}${nome.slice(1)}/${curta ? String(ano).slice(2) : ano}`;
}
