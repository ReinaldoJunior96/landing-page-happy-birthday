<div align="center">

# Lanna faz aniversário!

**Um convite recortado. Um prospecto nada sério. Uma central de presentes.**

HTML · CSS · JavaScript

[O visual](#um-documento-oficial-vestido-de-festa) · [No celular](#feito-para-abrir-no-celular) · [Página completa](#a-página-inteira) · [Rodar localmente](#para-ver-no-navegador)

</div>

![Capa da landing page: nome Lanna em letra manuscrita, globo espelhado, balões e foto de infância em Polaroid.](docs/screenshots/capa-desktop.jpg)

## Um documento oficial vestido de festa

O aniversário da Lanna virou uma landing page com a seriedade de um comunicado oficial — e pedidos de presente que vão de um look ao apartamento dos sonhos. Protocolos, carimbos e “fundos de investimento” entram na brincadeira.

O visual é de convite feito à mão: papel bege, fita preta atravessando a página, recortes coloridos, estrelas e fotos de infância coladas com fita. A letra manuscrita dá o tom da festa; os pequenos rótulos monoespaçados sustentam a piada burocrática.

## Escolha sua causa favorita

O catálogo reúne oito destinos para o presente. Cada card leva direto à sua seção, com uma história curta, valores selecionáveis e um botão para contribuir.

![Catálogo com oito causas de presentes, recortes e títulos bem-humorados.](docs/screenshots/catalogo.jpg)

## Até o apartamento entrou na lista

O prédio rosa ocupa o lugar de destaque na seção do sonho imobiliário. Ao lado, os valores aparecem em linhas simples: preço, uma piada e o indicador de seleção. O papel, a fita e as bordas discretas conectam o formulário à colagem.

![Seção do apartamento com recorte de um prédio rosa e opções de contribuição.](docs/screenshots/apartamento.jpg)

## Memórias que fazem parte da brincadeira

As quatro fotos de infância aparecem ao longo da narrativa: na capa, no look, no carro e no encerramento. Moldura clara, sombra suave, leve inclinação e legenda manuscrita dão a aparência de Polaroids guardadas num álbum.

A foto do triciclo acompanha o “fundo do carro inexistente”. No look, a legenda entrega: **“O look sempre foi assunto sério.”** As cores e a textura das fotografias originais foram preservadas.

<table>
  <tr>
    <td width="50%" align="center"><img src="docs/screenshots/polaroid-look.jpg" width="390" alt="Seção do look no celular, com foto de infância em moldura Polaroid e seleção de valores."></td>
    <td width="50%" align="center"><img src="docs/screenshots/encerramento.jpg" width="390" alt="Encerramento no celular com Polaroid, bolo, carimbo e piada circulada à mão."></td>
  </tr>
  <tr>
    <td align="center">O look sempre foi assunto sério.</td>
    <td align="center">Cresceu. O charme ficou.</td>
  </tr>
</table>

## Feito para abrir no celular

A composição se reorganiza sem perder os recortes grandes. Na capa, a Polaroid sai da lateral e aparece abaixo do convite para escolher um presente. Os cards e os valores se empilham, com espaço para ler e tocar.

<p align="center">
  <img src="docs/screenshots/capa-mobile.jpg" width="390" alt="Capa da página em uma viewport de 390 pixels, com título, botão e Polaroid empilhados.">
</p>

## Os detalhes do front-end

- **Tipografia com personalidade:** Caveat nos títulos e nas legendas, Barlow Condensed no texto e Space Mono nos protocolos.
- **Movimento no ritmo da página:** entradas de texto, carimbos, carro acompanhando a rolagem e um círculo de caneta na piada final. O site respeita a preferência por movimento reduzido.
- **Presente em poucos toques:** escolha de valor, modal com QR Code e Pix Copia e Cola, além de contribuição livre.
- **Imagens leves:** recortes e fotos em WebP, dimensões reservadas no layout e carregamento sob demanda.
- **Tudo local:** fontes e gerador de QR incluídos no projeto. Sem framework, etapa de build ou CDN em tempo de execução.

## A página inteira

Da primeira fita ao último carimbo: as dez seções na ordem em que aparecem no site. Clique na captura para explorar os detalhes em tamanho maior.

[![Captura completa da landing page, incluindo capa, catálogo, cabelo, olhar, unhas, look, apartamento, carro, Pix livre e encerramento.](docs/screenshots/pagina-completa.jpg)](docs/screenshots/pagina-completa.jpg)

## Para ver no navegador

```bash
git clone https://github.com/ReinaldoJunior96/landing-page-happy-birthday.git
cd landing-page-happy-birthday
python3 -m http.server 8000
```

Abra **http://localhost:8000**.

O conteúdo está em `index.html`; os estilos, em `assets/css/`; as interações, em `assets/js/`. As capturas deste README estão em `docs/screenshots/` e mostram o site real renderizado no Chrome, em desktop e em largura de 390px. O movimento foi reduzido durante as capturas para mostrar todos os elementos em seu estado final.
