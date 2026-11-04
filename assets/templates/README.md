# Template do aplicativo Bulbe

O componente `<bulbe-app>` reúne o cabeçalho, o menu inferior e o menu lateral. O centro fica livre para o conteúdo de cada HU.

## Abrir a prévia

Abra [app.html](app.html) por duplo clique ou com o Live Server. Em uma janela de computador, a moldura representa um iPhone SE de 2ª ou 3ª geração, com tela de 375 × 667 pixels CSS. Em uma janela de até 430 px, o aplicativo ocupa a tela disponível, sem a moldura.

O botão de três traços abre o menu. O botão de fechar, o clique na região escurecida e a tecla Esc fecham o menu. O foco permanece dentro do menu enquanto ele está aberto e retorna ao botão de abertura ao fechar. A lista do menu tem rolagem para alcançar os últimos itens na tela do iPhone SE.

## Reutilizar nas páginas

Em um arquivo de `pages/`, carregue o script e coloque o conteúdo dentro do componente:

```html
<script defer src="../assets/js/app-template.js"></script>

<bulbe-app
  section-label="CONTRATO"
  page-title="Minha contratação"
  subtitle="Seu vínculo, em um só lugar"
  greeting="Marina, acompanhe sua contratação."
  installation="3013588579"
  profile-initial="M"
  active-area="contrato">
  <section>
    <!-- Conteúdo da HU. -->
  </section>
</bulbe-app>
```

O componente carrega seu CSS, a fonte Inter e as imagens por caminhos relativos ao script. O carregamento usa um script clássico para funcionar também com arquivos locais, sem o bloqueio de módulos no protocolo `file:`. Não depende de `style.css` ou de bibliotecas externas. Seu Shadow DOM mantém os estilos do template separados dos estilos das páginas. A fonte tem uma folha global própria, pois as declarações `@font-face` precisam ficar no documento.

Por padrão, a altura do componente é `100dvh`. Quando o componente está em um contêiner com altura definida, use `--bulbe-app-height: 100%`. O conteúdo central tem rolagem própria. O cabeçalho e o menu inferior ficam fora dessa rolagem.

Os atributos do exemplo podem mudar após a criação do componente. Passe uma string vazia em `subtitle`, `greeting` ou `section-label` para ocultar esse texto.

## Conectar a navegação

Os menus notificam a página pelo evento `bulbe:navigate`. O template destaca a área selecionada e fecha o menu lateral. A página que usa o template controla a troca de conteúdo ou de URL.

```js
const app = document.querySelector('bulbe-app');

app.addEventListener('bulbe:navigate', (event) => {
  const area = event.detail.area;
  // Conecte aqui a navegação das telas implementadas pelo grupo.
});
```

As áreas são `faturas`, `economia`, `contrato`, `servico`, `duas-contas`, `ajuda` e `indicacoes`. As quatro abas inferiores são Faturas, Economia, Contrato e Ajuda. A área `duas-contas` também destaca a aba Faturas. As áreas Serviço e Indicações não destacam uma aba inferior.

O seletor de instalação tem uma opção de demonstração, configurada pelo atributo `installation`. O evento `bulbe:installation-change` informa o valor em `event.detail.installation`. O avatar é apenas uma identificação visual.

## Arquivos e origem visual

- `assets/js/app-template.js`: componente e comportamento dos menus.
- `assets/css/app-template.css`: estilos do aplicativo.
- `assets/css/app-fonts.css`: fonte Inter local.
- `assets/css/iphone-se-preview.css`: moldura da prévia, separada do aplicativo.
- `assets/img/app-template/`: SVGs do Figma e a logo fornecida pelo grupo.
- `assets/fonts/inter/`: arquivos da fonte e licença OFL.

Referências do [Figma do Squad 03](https://www.figma.com/design/2cpDUnDzNM7nVFdlHso0Ci/Bulbe---Squad-03---Wireframes?node-id=14-364): cabeçalho `103:200`, menu inferior `103:280` e menu lateral `103:879`. O desenho de 390 px de largura foi adaptado para o iPhone SE de 375 px.

`logo-original.png` é a imagem enviada pelo usuário. O CSS recorta visualmente o slogan, apresenta as letras em branco no cabeçalho e preserva as cores dos três traços. A imagem original continua intacta. Os SVGs são arquivos locais exportados do Figma. A fonte Inter usa a licença em [OFL.txt](../fonts/inter/OFL.txt).

Este template não implementa conteúdo das HUs, pagamento, autenticação nem atendimento real. Os textos e a instalação da prévia são dados de demonstração.
