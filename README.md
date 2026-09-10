# Central de Presentes da Lana

Landing page única (sem páginas internas) de vitrine de presentes de aniversário.
HTML, CSS e JavaScript puros — sem build, sem dependência para instalar.

## Como rodar

Basta abrir o `index.html` no navegador. Para o botão "copiar código Pix"
funcionar em qualquer navegador, é melhor servir por HTTP:

```bash
cd ~/projects/niver-lana
python3 -m http.server 8000
# abre http://localhost:8000
```

## O que você precisa configurar

Tudo fica em **`assets/js/config.js`**:

| Campo | O que é |
|---|---|
| `pixChave` | Chave Pix da Lana (CPF, e-mail, telefone `+55…` ou aleatória). **Obrigatório** |
| `pixNome` | Nome do titular como está no banco (máx. 25 caracteres) |
| `pixCidade` | Cidade do titular (máx. 15 caracteres) |
| `whatsapp` | Número com DDI, só dígitos — ex.: `5511999999999`. Vazio esconde o botão |
| `qrCodeImagem` | QR original do banco, usado quando não há valor escolhido |
| `pixCodigoOriginal` | Copia e cola decodificado da imagem original, sem valor |
| `nome` | Nome da aniversariante (troca no site inteiro de uma vez) |

Enquanto `pixChave` estiver vazio, o site mostra um aviso honesto de
"chave pendente" em vez de um QR Code falso.

## Como o Pix funciona aqui

A chave e o nome da titular já estão configurados com os dados fornecidos.
A cidade **São Luís** foi obtida da leitura de `assets/img/qr.png`. O QR
original teve o conteúdo e o CRC conferidos.

O site monta o **Pix Copia e Cola** (BR Code / EMV-MPM, padrão do Banco Central)
em `assets/js/pix.js`, já com o valor escolhido embutido — quem for presentear
não precisa digitar o valor. O QR Code é desenhado a partir desse mesmo código.

Quando o campo de valor fica vazio, o site usa a imagem original do banco e
o respectivo `pixCodigoOriginal`. Quando há valor escolhido, gera um novo QR
local a partir do mesmo copia e cola exibido. Assim, a imagem e o código
sempre correspondem, inclusive quanto ao valor.

O CRC16-CCITT do payload foi conferido contra o valor de referência do padrão.

O gerador de QR (`assets/js/vendor-qrcode.js`, qrcode-generator, licença MIT)
fica **dentro do projeto**, não em CDN: a página inteira funciona offline e não
quebra se a internet do convidado estiver ruim na hora de pagar.

## Estrutura da página

| # | Seção | id |
|---|---|---|
| 01 | Capa — comunicado oficial | `#capa` |
| 02 | Menu de causas (8 opções) | `#menu` |
| 03 | Cabelo | `#cabelo` |
| 04 | Cílios + sobrancelha | `#olhar` |
| 05 | Unhas | `#unhas` |
| 06 | Look | `#look` |
| 07 | Apartamento | `#apartamento` |
| 08 | Carro | `#carro` |
| 09 | Pix livre | `#pix` |
| 10 | Final | `#final` |

## Design

**Convite recortado com humor de prospecto oficial.** A referência visual é um
convite em papel bege, com fotografias coloridas grandes, fita preta,
estrelas e letra à mão. O conteúdo mantém os carimbos, protocolos e causas da
página original. As dez seções e as âncoras foram preservadas.

- Papel bege `#F1EBDD`, grafite `#22201D` e cereja `#A91F26` nos títulos e traços.
- Amarelo manteiga `#F3D07A` nas seleções e sublinhados; musgo `#23504E` em
  detalhes herdados, como alguns carimbos.
- Os recortes mantêm as **cores originais**, inclusive rosa e vermelho.
- **Caveat** nos títulos e no nome; **Barlow Condensed** no corpo, botões e
  valores; **Space Mono** nos pequenos rótulos de protocolo.
- As fontes WOFF2 e suas licenças SIL OFL ficam em `assets/fonts/`. Não há
  requisição de fontes a serviços externos em tempo de execução.
- Os valores são linhas simples, com preço, piada curta e indicador de seleção.
  A tipografia numérica é legível e os alvos de toque têm pelo menos 44px.

A camada visual dessa revisão está em `assets/css/convite.css`, carregada
entre o visual base e a camada de animações. Ela troca os fundos estampados
pelo papel liso e amplia os objetos, sem desenhar substitutos em SVG/CSS.
**Não há bandeirinhas ou elementos de festa junina.**

### Aplicação dos recortes

| Original | Conteúdo / resolução original | Uso |
|---|---|---|
| `1.png` | Balões de coração · 189 × 238 | Capa e rodapé final |
| `2.png` | Batom · 187 × 214 | Não usado: maquiagem não corresponde a uma causa |
| `3.png` | Carro conversível · 255 × 178 | Card do carro e estrada |
| `4.png` | Chaves com chaveiro de casa · 173 × 193 | Card e título do apartamento |
| `5.png` | Presente com laço · 223 × 309 | Título do catálogo e rodapé final |
| `6.png` | Bolo com velas · 274 × 358 | Encerramento |
| `7.png` | Globo espelhado · 203 × 223 | Grande na borda da capa e no rodapé |

Os originais permanecem em `assets/img/elementos/`. O navegador carrega
somente as cópias WebP de `otimizados/`: **96 kB no total**, contra
451,5 kB dos seis PNGs correspondentes (redução de aproximadamente 79%).
Foi aparada a margem transparente, preservando os objetos, sua cor e o alpha;
a compressão WebP usa qualidade 88. Não houve ampliação artificial dos arquivos.
As dimensões finais são 158 × 221 (balões), 249 × 124 (carro), 158 × 164
(chaves), 202 × 229 (presente), 271 × 322 (bolo) e 163 × 193 (globo).

As imagens têm dimensões explícitas; fora da capa, carregam sob demanda com
`loading="lazy"`. Todas são decorativas ou redundantes com o texto adjacente,
portanto usam `alt=""` e `aria-hidden="true"`. Os emojis restantes identificam
as causas sem recorte correspondente ou fazem parte das piadas.

### Fotos de infância em Polaroid

As quatro fotos fornecidas foram distribuídas pela página, sem criar uma
seção adicional: `foto1` na capa, `foto2` no look, `foto3` no carro e `foto4`
no encerramento. As molduras usam papel claro, rodapé largo com legenda em
Caveat, sombra discreta e uma fita translúcida. A fotografia mantém suas cores
e textura originais, sem filtro sépia ou alteração do rosto.

Os JPEGs em `assets/img/foto1.jpeg` até `foto4.jpeg` estão preservados. A página
carrega as cópias WebP em `assets/img/memorias/`, com largura de 640px e
qualidade 86: aproximadamente 182 kB no total. Todas têm dimensões explícitas,
`loading="lazy"`, `decoding="async"` e texto alternativo descritivo.

O enquadramento é definido pelo CSS: `--foco-foto` em cada `.polaroid--fotoN`.
As fotos 1, 2 e 4 têm janela quadrada; a foto 3 usa 4:5 para mostrar o
triciclo. Os arquivos guardam a imagem inteira. O giro da moldura fica na
figura interna, separado da animação de entrada, preservando o modo de
movimento reduzido. A capa mostra a foto ao lado do texto em telas grandes e
abaixo do botão no celular.

## Animações

Tudo em CSS + IntersectionObserver, sem biblioteca de animação. O visual base
está em `assets/css/style.css`; o movimento em `assets/css/animacoes.css` e
`assets/js/animacoes.js`.

**Entrada**
- cascata por seção (`data-reveal`, `data-stagger`)
- títulos que sobem palavra por palavra (`data-palavras`), preservando as
  marcações internas
- sublinhado amarelo que se desenha da esquerda para a direita
- carimbos que caem, amassam no papel e assentam, com onda de impacto

**Tempo de piada**
Piada precisa de pausa. `data-atraso="760"` no HTML segura a punchline —
usado no "Não." do cabelo, no "Mas isso nunca impediu ninguém" do look e no
"(ou não. mas provavelmente sim.)" do final.

**Ligadas ao scroll** (todas num único `requestAnimationFrame`, via o
barramento `window.LANA.aoRolar`)
- parallax de camadas na capa: fundo, miolo e faixa em velocidades diferentes
- carro que atravessa a estrada, inclina conforme a velocidade da rolagem,
  deixa rastro e marca a quilometragem ao vivo
- barra de progresso e contador de seção no botão flutuante

**Por seção**
- prédio que sobe andar por andar, com janelas acendendo e poeira de obra
- cartão "situação atual" que treme, "situação desejada" que reluz
- confete de estrelas, discos e fitinhas caindo uma vez na seção final
- círculo de caneta que se desenha sozinho em volta da piada final
- valor do modal que sobe contando em vez de aparecer pronto

Respeita `prefers-reduced-motion`: quem tem movimento reduzido no sistema vê a
página inteira estática — o JS nem chega a registrar os efeitos de scroll.

## Para editar os textos e valores

Cada faixa de valor é um `<button class="tier" data-valor="50">` no `index.html`.
Mudar o valor, a piada ou acrescentar uma faixa é só copiar um bloco desses —
o JavaScript se ajusta sozinho.

Para segurar mais (ou menos) uma piada, mexa no `data-atraso` do elemento,
em milissegundos.

## Verificação visual e do Pix

A página foi renderizada no Chrome headless por HTTP, em desktop (1440px) e
em iframe com largura real de 390px, com e sem movimento reduzido. A
conferência cobre capa, catálogo, valores, Pix e encerramento.

Além da inspeção visual, os testes conferem as dez seções, oito causas,
âncoras, imagens, fontes locais e ausência de transbordamento horizontal.
Na revisão colorida, o cartão do Pix recebeu uma coluna com tamanho mínimo
zero para que o copia e cola longo não alargue o layout no celular.

O QR original foi decodificado e comparado com a chave/cidade configuradas.
Também foi decodificado um QR gerado com valor, confirmando destinatário,
valor e igualdade com o copia e cola. O estado sem valor foi conferido contra
a imagem original do banco. O decodificador usado nesses testes é temporário;
nenhuma biblioteca de leitura de QR foi adicionada ao site.

Os fluxos de escolha de valor, chips, valor personalizado, modal,
Escape/retorno de foco e estado sem chave foram exercitados. A API de clipboard
é interceptada para conferir o conteúdo enviado à cópia; isso não testa a
área de transferência do sistema operacional. Não foi realizado pagamento.
