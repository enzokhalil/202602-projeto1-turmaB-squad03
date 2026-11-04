"""Gera a demonstração file:// a partir das fontes reais; sem dependências.

Executar novamente após alterar hu02.js, hu02-model.js ou os JSONs.
Use --check para verificar se a cópia distribuída continua atualizada.
"""
import argparse
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
args = parser.parse_args()

dados = {nome: json.loads((root / f'data/{nome}.json').read_text()) for nome in ['clientes', 'faturas']}
model = (root / 'assets/js/hu02-model.js').read_text()
view = (root / 'assets/js/hu02.js').read_text()
# As únicas importações do renderer são as duas dependências locais conhecidas.
imports = re.findall(r'^import .*? from [\'"](.*?)[\'"];\n', view, flags=re.M)
assert imports == ['./api.js', './hu02-model.js'], 'Atualize o gerador para as novas dependências.'
view = re.sub(r'^import .*?;\n', '', view, flags=re.M)
model = re.sub(r'^export ', '', model, flags=re.M)
bundle = '''// GERADO por scripts/gerar-demo-hu02.py. Não editar diretamente.
// Somente dados fictícios. Em HTTP, o loader usa api.js/fetch normalmente.
(() => {
'''
bundle += 'const demo = ' + json.dumps(dados, ensure_ascii=False, separators=(',', ':')) + ';\n'
bundle += '''async function buscarClientes() { return demo.clientes; }
async function buscarFaturasDoCliente(clienteId) {
  return demo.faturas.filter((fatura) => fatura.clienteId === clienteId);
}
'''
bundle += model + '\n' + view + '\n})();\n'
target = root / 'assets/js/hu02-offline.js'
if args.check:
    if not target.exists() or target.read_text() != bundle:
        raise SystemExit('Demonstração desatualizada. Execute python3 scripts/gerar-demo-hu02.py')
    print('Demonstração sincronizada com os arquivos JS e JSON.')
else:
    target.write_text(bundle)
    print(f'Gerado: {target}')
