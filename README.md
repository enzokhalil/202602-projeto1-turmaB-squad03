# Bulbe Energia: da adesão à primeira fatura

Projeto em Ciência de Dados I, Ibmec BH, 2º semestre de 2026. **Turma B, Squad 03.**

**Empresa parceira:** Bulbe Energia.

**Professor:** Cristiano de Macedo Neto.

Frontend acadêmico que ajuda o cliente novo a entender o serviço contratado, conferir a economia e distinguir as cobranças da Bulbe e da Cemig.

## 1. Problema

O grupo escolheu investigar a falta de clareza nas primeiras cobranças. O cliente pode ter dúvidas sobre o que contratou, como a economia aparece e por que recebe uma fatura da Cemig e outra da Bulbe.

O roteiro da Etapa 2 apresenta **32,4% de inadimplência na primeira fatura**, entre setembro de 2025 e julho de 2026. Também informa cerca de 20% de falha na entrega de mensagens por WhatsApp e situações de até 20 dias sem comunicação durante o onboarding.

**Fonte:** material da Bulbe Energia reproduzido no [roteiro da Etapa 2 da disciplina](https://docs.google.com/document/d/14SpYXCmTpKkOcLHv6X9748ZEXL4ni0p1azWpK9Lz4sI/edit).

**Indicador principal:** percentual de inadimplência na primeira fatura. A hipótese é que explicar o serviço e as cobranças ajude o cliente a pagar com segurança. O dado contextualiza o problema, mas não demonstra sozinho a causa dos atrasos.

## 2. Persona e jornada

A [persona principal consolidada](docs/personas/persona-principal.md) é Rafael, 41 anos, cliente novo que precisa entender o serviço e as duas faturas para confiar e pagar no prazo. Ela combina a necessidade de transparência de Rafael com a dúvida de André sobre uma possível cobrança em duplicidade.

As jornadas que sustentam esse recorte são a [jornada de Rafael](docs/jornadas/jornada-integrante-3.md) e a [jornada de André](docs/jornadas/jornada-integrante-5.md). Os demais perfis e percursos ficam em [personas](docs/personas/) e [jornadas](docs/jornadas/).

Os momentos críticos são a adesão, a espera pela primeira fatura e a conferência das primeiras cobranças. As personas são fictícias e orientam o desenho acadêmico da solução.

## 3. Solução e histórias

A solução organiza informações de contratação, economia, contas e atendimento em uma experiência para celular. HU03 e HU05 representam o recorte central da persona principal. As outras histórias apoiam a consulta e a compreensão da cobrança.

| História | Telas propostas | Necessidade | Responsável |
| --- | --- | --- | --- |
| [HU01](historias/historia-integrante-1.md) | Minha economia e Entenda sua economia | Conferir valores e entender o benefício | Enzo Khalil |
| [HU02](historias/historia-integrante-2.md) | Minhas contas, Minha fatura e Histórico de contas | Encontrar valor, vencimento e situação das contas | Rafael Lombardi |
| [HU03](historias/historia-integrante-3.md) | Minha contratação e Meu documento | Confirmar o serviço e consultar as condições | Rhuan Matavellhe |
| [HU04](historias/historia-integrante-4.md) | Como a Bulbe funciona | Entender o serviço e as etapas da jornada | Igor Mata Machado |
| [HU05](historias/historia-integrante-5.md) | Entenda suas contas | Distinguir as cobranças Bulbe e Cemig | Marcio Filho |
| [HU06](historias/historia-integrante-6.md) | Atendimento, Minha solicitação e Cancelar assinatura | Encontrar ajuda e acompanhar solicitações | Caio Campos |

As imagens, os estados alternativos e os links dos quadros de origem estão no [índice de wireframes](docs/wireframes/README.md). O conjunto revisado contém 19 telas exportadas do [Figma do Squad 03](https://www.figma.com/design/2cpDUnDzNM7nVFdlHso0Ci/Bulbe---Squad-03---Wireframes?node-id=14-364).

## 4. Tecnologias e template

- HTML, CSS e JavaScript puro, sem framework de interface.
- Dados fictícios em JSON na pasta [data/](data/), com funções de leitura em [api.js](assets/js/api.js).
- Git e GitHub para branches, Issues, Pull Requests e revisão.
- Componente compartilhado `bulbe-app` para a barra superior, o menu inferior e o menu lateral.
- Prévia de iPhone SE de 375 × 667 pixels CSS, com conteúdo central rolável.

O [guia do template](assets/templates/README.md) explica como inserir o conteúdo de uma HU sem repetir o código dos menus. Título, saudação, instalação e informações específicas pertencem a cada página.

## 5. Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/enzokhalil/202602-projeto1-turmaB-squad03.git
   ```

2. Abra a pasta no VS Code.
3. Instale a extensão Live Server, sugerida pelo projeto.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**. A demonstração abre em **Minha economia**. Use o menu para acessar as seis histórias e as abas inferiores para alternar entre Faturas, Economia, Contrato e Ajuda.
5. Acesse as páginas da solução em [assets/telas/](assets/telas/README.md), conforme as entregas integradas à sua branch.

O Live Server é o modo de execução do projeto com JSON via `fetch`. O template e algumas prévias estáticas também abrem por duplo clique.

## 6. Estrutura

```text
├── index.html          # Entrada do projeto
├── pages/              # Endereços antigos e página de exemplo
├── assets/
│   ├── css/            # Estilos compartilhados e de cada HU
│   ├── js/             # Template, acesso a dados e lógica das páginas
│   ├── img/            # Logo e recursos visuais
│   ├── fonts/          # Fonte Inter e licença
│   ├── templates/      # Prévia e guia do componente compartilhado
│   └── telas/          # Telas HTML entregues por integrante
├── data/               # Dados fictícios em JSON
├── historias/          # Histórias e critérios de aceite
├── docs/
│   ├── personas/       # Personas individuais e consolidada
│   ├── jornadas/       # Jornadas dos integrantes
│   ├── wireframes/     # Imagens e documentação das telas
│   └── sprints/        # Registros das reviews
└── .github/            # Modelos de Issues e Pull Request
```

## 7. Organização do trabalho

- [Quadros vinculados ao repositório](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/projects).
- [Issues do grupo](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/issues).
- [Pull Requests](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/pulls).

Cada integrante responde por uma história e suas telas. A implementação ocorre em branches e entra na `main` por Pull Request. O grupo usa os registros das reviews para acompanhar entregas, pendências e próximos passos.

## 8. Equipe

| Integrante | GitHub | Responsabilidade |
| --- | --- | --- |
| Enzo Khalil | [@enzokhalil](https://github.com/enzokhalil) | HU01, economia e template compartilhado |
| Rafael Lombardi | [@RLrafael01](https://github.com/RLrafael01) | HU02, contas, fatura e histórico |
| Rhuan Matavellhe | [@MdRhuan](https://github.com/MdRhuan) | HU03, contratação e documento |
| Igor Mata Machado | [@igllmm](https://github.com/igllmm) | HU04, funcionamento do serviço e jornada |
| Marcio Filho | [@marcio-lcf](https://github.com/marcio-lcf) | HU05, contas Bulbe e Cemig |
| Caio Campos | [@Caiocampos21](https://github.com/Caiocampos21) | HU06, atendimento e solicitações |

## 9. Entregas

Situação conferida em 05/11/2026. Uma prévia HTML não representa, por si só, a conclusão de todos os critérios da história.

| Marco | Situação |
| --- | --- |
| Personas e jornadas | Documentadas por integrante e na síntese principal |
| Histórias | Seis histórias disponíveis em `historias/` |
| Wireframes | Conjunto atualizado em `docs/wireframes/` |
| Sprint Review I | [Registro da Sprint I](docs/sprints/sprint-review-1.md) |
| Template | Integrado à `main` pelo [PR #32](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/pull/32) |
| HU01 | Duas prévias HTML recuperadas do [PR #33](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/pull/33) e integradas à `main` em `assets/telas/` |
| HU02 | Páginas integradas à `main` pelo [PR #34](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/pull/34) |
| HU03 | Minha contratação e Meu documento, entregues no PR #37 |
| HU04 | Tela e etapas disponíveis na demonstração |
| HU05 | Entenda suas contas, integrada à `main` pelo PR #38 |
| HU06 | Telas integradas à `main` pelo [PR #35](https://github.com/enzokhalil/202602-projeto1-turmaB-squad03/pull/35) |
| Demais implementações e integração | Em desenvolvimento na Sprint II |
| Sprint Review II | Prevista para 06/11/2026, conforme o roteiro da Turma B |
| Versão final | Congelamento até 12/11/2026, conforme o roteiro da Turma B |

Todos os nomes, valores, faturas, datas e protocolos das telas são exemplos fictícios para fins acadêmicos. O grupo mantém esses exemplos conforme a orientação do professor. Nenhum dado real de cliente da Bulbe é utilizado.
