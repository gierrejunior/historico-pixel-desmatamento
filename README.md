# O que acontece com a terra depois de desmatada

Página única e autocontida que acompanha cada pixel de 10 m desmatado segundo o
PRODES entre 2016 e 2024, ano a ano, no MapBiomas 10 m (coleção 4) de 2017 a
2025. Filtros por ano do desmatamento, bioma, UF e zona agroecológica (AEZ).

**Abrir:** https://gierrejunior.github.io/historico-pixel-desmatamento/ (v1)
· **v2, em avaliação:** https://gierrejunior.github.io/historico-pixel-desmatamento/v2/

## O que tem na página

- **Sankey ano a ano** do uso da terra, de 2017 a 2025. Com um ano só de
  desmatamento escolhido, começa no ano anterior ao corte.
- **Antes e depois do desmatamento:** todos os anos alinhados pelo ano do corte,
  de 3 anos antes a 9 anos depois.
- **Cruzamentos** por bioma, UF, UF × bioma, AEZ, AEZ × UF × bioma e ano, com o
  uso em qualquer ano de 2017 a 2025. Clique numa linha para filtrar; baixa em CSV.
- **Trajetórias mais comuns**, a sequência de uso de cada ano.

## Números principais — uso em 2025 da área desmatada de 2016 a 2024

| Bioma (PRODES) | Desmatado (ha) | Pastagem % | Agricultura % | Silvicultura % | Veg. nativa % | Outros % |
|---|---:|---:|---:|---:|---:|---:|
| **Brasil** | 20.552.580 | 53,3 | 10,0 | 0,7 | 19,2 | 16,7 |
| Amazônia | 8.039.474 | 76,1 | 4,1 | 0,1 | 13,4 | 6,3 |
| Cerrado | 7.450.545 | 41,0 | 13,1 | 0,6 | 16,7 | 28,7 |
| Caatinga | 2.475.362 | 43,2 | 5,7 | 0,0 | 33,9 | 17,2 |
| Mata Atlântica | 998.345 | 35,1 | 15,7 | 6,7 | 20,8 | 21,7 |
| Pampa | 906.891 | 0,0 | 50,3 | 2,9 | 32,0 | 14,8 |
| Pantanal | 681.962 | 54,0 | 0,1 | 0,0 | 43,4 | 2,5 |

"Outros" junta mosaico de usos agropecuários, área não vegetada, água e sem classe.

## De onde vêm os dados

- **Desmatamento:** PRODES *yearly_deforestation* dos seis biomas (INPE), 2016 a
  2024. O ano PRODES vai de agosto do ano anterior a julho do ano.
- **Uso depois:** MapBiomas 10 m, coleção 4, 2017 a 2025, na mesma grade do PRODES
  rasterizado, sem reamostragem. As classes são juntadas em 8 grupos; **"Floresta"
  inclui a formação savânica**, a vegetação nativa lenhosa do Cerrado.
- **Dois biomas, de propósito:** *bioma PRODES* é o limite físico, como o INPE
  mapeia; *bioma municipal* é o rótulo do município inteiro (Mun_UF_Biomas), o
  recorte dos modelos econômicos e das AEZ. A página deixa escolher. Os dois
  discordam em 3,7% da área desmatada.
- **AEZ:** zonas agroecológicas do GTAP v9 (AEZ18); no Brasil, 2 a 6 e 10 a 12.
- **Área:** pixel a pixel, com a área de cada linha em projeção de área igual
  (EPSG:6933).

## Para ler com cuidado

PRODES e MapBiomas não são o mesmo mapa:

- O corte de agosto a dezembro já aparece no MapBiomas do ano anterior ao ano
  PRODES; por isso a vegetação nativa cai bastante já no "−1".
- Três anos antes do corte, o MapBiomas já via uso em ~10% da área na Amazônia e
  no Cerrado, ~20% na Caatinga e ~40% na Mata Atlântica.
- **"Floresta em todos os anos" é 11,4% da área**, estável em todos os anos de
  desmatamento: não é regeneração, é área que o PRODES dá como desmatada e o
  MapBiomas nunca viu sair da vegetação nativa.
- **"Pastagem em todos os anos" é 13,1%**, mais da metade dos desmatamentos de
  2016 e 2017, cortados antes do primeiro mapa (2017).

## Conferência

2.120.876.129 pixels no cubo de trajetórias, os mesmos do PRODES rasterizado, ano
a ano e bioma a bioma. A área por bioma da página bate com as tabelas de origem
dentro de 10 ha.

## v2 (em avaliação)

https://gierrejunior.github.io/historico-pixel-desmatamento/v2/ — acrescente `?validar`
para a página conferir a si mesma contra o PRODES rasterizado.

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
- **Mapa com linha do tempo** (em preparação): o que cada área virou, ano a ano.

Brasil, desmatamento 2016-2024, **1 ano depois do corte**: 50,5% pastagem, 5,8%
agricultura, 22,8% ainda vegetação nativa — 15,8% que o MapBiomas nunca viu
convertida (desacordo entre os mapas), 0,8% regenerada e o resto em que o uso
ainda não apareceu.
