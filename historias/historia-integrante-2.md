# HU02 — Encontrar e consultar as contas

**Responsável:** @RLrafael01  
**Issue existente:** https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/issues/3  
**Prioridade proposta:** alta — MVP.

## História
Como Marina, cliente nova da Bulbe Energia, quero encontrar minhas contas em um único lugar e consultar o valor, o vencimento e a situação de cada uma para me organizar e pagar a primeira fatura dentro do prazo.

## Oportunidade de origem
Jornada do integrante 2, persona Marina, nas fases “Espera pela fatura” e “Recebimento e pagamento”: reforçar as informações de cobrança e permitir que o cliente encontre os dados necessários para pagar.

Arquivo de origem: `docs/jornadas/jornada-integrante-2.md`.

A issue de oportunidade correspondente ainda precisa ser identificada ou criada pelo squad e vinculada aqui; não foi inventado um número de issue.

## Evidência e indicador
O roteiro da Etapa 2 informa inadimplência de 32,4% na primeira fatura e clientes que ficaram até 20 dias sem comunicação durante o onboarding.

**Indicador que a solução pretende mover:** pagamento da primeira fatura no prazo. A hipótese é que facilitar a consulta ajude o cliente a se organizar. O protótipo não comprova redução de inadimplência.

## Critérios de aceite
- [ ] Ao acessar “Minhas contas”, o cliente de demonstração vê somente as faturas vinculadas ao seu ID, carregadas de `data/faturas.json` via `fetch`, usando `assets/js/api.js`.
- [ ] Cada conta mostra referência, valor em reais, vencimento e situação por escrito: prevista, em aberto, vencida ou paga. Uma conta em aberto com vencimento anterior à data de consulta é exibida como vencida.
- [ ] Ao selecionar “Ver detalhes”, o usuário vê os dados da conta escolhida e consegue voltar à lista.
- [ ] Uma conta prevista aparece como estimativa, com aviso de que ainda não foi emitida; não oferece pagamento.
- [ ] Se o cliente não tiver contas, a tela informa “Você ainda não tem contas disponíveis”, sem apresentar erro nem valor fictício como cobrança real.
- [ ] Durante a leitura do JSON, aparece “Carregando suas contas…”. Se houver falha, aparece uma explicação e o botão “Tentar novamente”.
- [ ] A tela pode ser acessada pela navegação do projeto e oferece retorno ao início. Os links de integração com outras histórias usam os destinos combinados com o squad.
- [ ] Em largura de 375 px, a tela não tem rolagem horizontal; botões têm altura mínima de 44 px, foco visível e podem ser usados por teclado.
- [ ] Todos os dados são fictícios e identificados como demonstração.

## Tela e navegação
**Arquivo proposto:** `pages/contas.html`  
**Wireframe:** pendente — será adaptado de uma tela do Figma da disciplina e entregue em um PR separado.

Início → Minhas contas → Ver detalhes → Voltar para contas.

Links de integração propostos: “Entender esta conta” → HU05; “Preciso de ajuda” → HU06. Confirmar os nomes dos arquivos com os responsáveis antes de implementar.

## Limites desta história
Inclui consulta de lista e detalhes. Explicações sobre as contas Cemig/Bulbe pertencem à HU05; atendimento pertence à HU06. Pagamento real, envio de mensagens e autenticação ficam fora desta proposta. A seleção do cliente é simulada no protótipo, sem representar controle real de acesso.

## Tarefas
- [ ] Validar a história e os critérios com o squad.
- [ ] Adicionar o wireframe ao repositório e apresentar na Sprint Review I.
- [ ] Confirmar a navegação e os destinos das HU05 e HU06.
- [ ] Implementar HTML/CSS, leitura de JSON e estados da tela.
- [ ] Testar com contas previstas, abertas, vencidas, pagas, lista vazia e falha de carregamento.
- [ ] Abrir Pull Request e solicitar revisão de outro integrante quando a implementação estiver pronta.

