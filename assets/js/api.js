// Funções de acesso aos dados. Toda leitura de JSON passa por aqui.
// Importante: fetch só funciona com o projeto aberto por um servidor (Live Server),
// e não abrindo o arquivo direto no navegador (file://).

const BASE = new URL('../../data/', import.meta.url);

async function lerJSON(arquivo) {
  const resposta = await fetch(new URL(arquivo, BASE));
  if (!resposta.ok) {
    throw new Error(`Erro ao carregar ${arquivo}: ${resposta.status}`);
  }
  return resposta.json();
}

export function buscarClientes() {
  return lerJSON('clientes.json');
}

export function buscarFaturas() {
  return lerJSON('faturas.json');
}

export async function buscarFaturasDoCliente(clienteId) {
  const faturas = await buscarFaturas();
  return faturas.filter((fatura) => fatura.clienteId === clienteId);
}

// --- HU06: atendimento e acompanhamento de solicitações ---
export function buscarCanais() {
  return lerJSON('canais.json');
}

export function buscarAssuntos() {
  return lerJSON('assuntos.json');
}

export function buscarCancelamento() {
  return lerJSON('cancelamento.json');
}

export function buscarSolicitacoes() {
  return lerJSON('solicitacoes.json');
}

export async function buscarSolicitacoesDoCliente(clienteId) {
  const solicitacoes = await buscarSolicitacoes();
  return solicitacoes.filter((s) => s.clienteId === clienteId);
}
