import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { situacao, proximaConta, ordenarContas, moeda, dataCompleta } from '../assets/js/hu02-model.js';

const hoje = new Date(2026, 10, 4, 12);
const base = { id: 1, referencia: '2026-10', vencimento: '2026-11-04', valor: 260.72, status: 'aberta' };

test('vencimento no dia permanece aberto; ontem fica vencido', () => {
  assert.equal(situacao(base, hoje), 'aberta');
  assert.equal(situacao({ ...base, vencimento: '2026-11-03' }, hoje), 'vencida');
});
test('paga e prevista não viram vencidas automaticamente', () => {
  for (const status of ['paga', 'prevista']) assert.equal(situacao({ ...base, status, vencimento: '2020-01-01' }, hoje), status);
});
test('dá prioridade à cobrança emitida mais antiga, mesmo com previsão futura', () => {
  const vencida = { ...base, id: 2, vencimento: '2026-11-01' };
  const prevista = { ...base, id: 3, referencia: '2026-11', status: 'prevista' };
  assert.equal(proximaConta([prevista, base, vencida], hoje).id, 2);
  assert.equal(proximaConta([prevista], hoje).id, 3);
  assert.equal(proximaConta([], hoje), undefined);
});
test('histórico ordena sem modificar a origem', () => {
  const lista = [{ ...base, referencia: '2026-07' }, { ...base, referencia: '2026-10' }];
  assert.equal(ordenarContas(lista)[0].referencia, '2026-10');
  assert.equal(lista[0].referencia, '2026-07');
});
test('formata moeda e data em português', () => {
  assert.match(moeda(260.72), /260,72/);
  assert.equal(dataCompleta('2026-11-12'), '12/11/2026');
});
test('dados de demonstração têm IDs únicos e totais consistentes', async () => {
  const lista = JSON.parse(await readFile(new URL('../data/faturas.json', import.meta.url), 'utf8'));
  assert.equal(new Set(lista.map((f) => f.id)).size, lista.length);
  for (const f of lista.filter((f) => f.energiaElegivel !== undefined)) {
    assert.equal(Math.round((f.energiaElegivel - f.economia + f.outros) * 100), Math.round(f.valor * 100));
  }
});
