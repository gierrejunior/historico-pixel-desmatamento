# O que acontece com a terra depois de desmatada

Página única e autocontida que acompanha cada pixel de 10 m desmatado segundo o
PRODES entre 2016 e 2024, ano a ano, no MapBiomas 10 m (coleção 4) de 2017 a
2025. Filtros por ano do desmatamento, bioma, UF e zona agroecológica (AEZ).

**Abrir:** https://gierrejunior.github.io/historico-pixel-desmatamento/ — acrescente `?validar`
ao endereço para a página conferir a si mesma contra o PRODES rasterizado.

## O que tem na página

- **Filtros de três estados** (+ precisa ter, − não pode ter): ano do desmatamento,
  bioma (PRODES ou municipal), UF, UF × bioma, AEZ, AEZ × UF × bioma (o território)
  e tipo de trajetória.
- **Defasagem montável:** o MapBiomas leva 1 a 2 anos para ver o corte do PRODES; a
  página deixa olhar o uso sem defasagem, 1, 2, 3... anos depois do corte, e o
  Sankey parte de uma coluna "Desmatado pelo PRODES (era vegetação nativa)".
- **Vegetação nativa separada pelo que aconteceu com ela:** até o uso aparecer,
  nunca vista convertida, em regeneração, regenerada.
- **Perguntas e respostas**, matriz ano do desmatamento × anos depois do corte,
  comparações (Sankey por categoria, linhas, barras, treemap, sunburst), tabela com
  Σ, trajetórias, detalhe por classe, seguir uma área, CSV, PNG e link.
- **Mapa com linha do tempo:** escolha o ano PRODES e aperte ▶ para ver o que cada
  área virou, ano a ano (calendário ou anos depois do corte); clique num ponto para
  ver a trajetória dele. Pixel de ~75 m no zoom máximo.

Brasil, desmatamento 2016-2024, **1 ano depois do corte**: 50,5% pastagem, 5,8%
agricultura, 22,8% ainda vegetação nativa — 15,8% que o MapBiomas nunca viu
convertida (desacordo entre os mapas), 0,8% regenerada e o resto em que o uso
ainda não apareceu.

## De onde vêm os dados

- **Desmatamento:** PRODES *yearly_deforestation* dos seis biomas (INPE), 2016 a
  2024. O ano PRODES vai de agosto do ano anterior a julho do ano.
- **Uso depois:** MapBiomas 10 m, coleção 4, 2017 a 2025, na mesma grade do PRODES
  rasterizado, sem reamostragem; 10 categorias que somam os 8 grupos do raster mestre.
- **Dois biomas, de propósito:** *bioma PRODES* (limite físico) e *bioma municipal*
  (rótulo do município, o recorte dos modelos e das AEZ). Discordam em 3,7% da área.
- **AEZ:** zonas agroecológicas do GTAP v9 (AEZ18).
- **Área:** pixel a pixel, área de cada linha em EPSG:6933.

## Conferência

2.120.876.129 pixels no cubo de trajetórias, os mesmos do PRODES rasterizado, ano a
ano e bioma a bioma. A página confere a si mesma com `?validar`: área por ano ×
bioma igual ao PRODES (54/54), colunas do Sankey, quebras e filtros somando o total.

O endereço antigo `/v2/` redireciona para cá. A primeira versão (v1) está no
histórico do repositório.
