# O que acontece com a terra depois de desmatada

Página única e autocontida que acompanha cada pixel de 10 m desmatado segundo o
PRODES entre 2016 e 2024, ano a ano, no MapBiomas 10 m (coleção 4) de 2017 a
2025. Filtros por ano do desmatamento, bioma, UF e zona agroecológica (AEZ).

**Abrir:** https://gierrejunior.github.io/historico-pixel-desmatamento/ — acrescente `?validar`
ao endereço para a página conferir a si mesma contra o PRODES rasterizado.

## O que tem na página

O ponto de partida é o PRODES: pela definição dele, toda esta área era vegetação nativa
até a supressão. O MapBiomas é a lente do que veio depois.

- **Modo de análise: Simplificado | Detalhado** (como no explorador PRODES). O
  Simplificado (abre assim) agrupa os usos, junta em *Ainda vegetação no MapBiomas* o
  que o MapBiomas atrasado, a folga de datas e o "não confirma" mostram, e fica com os
  filtros ano, bioma, UF e tipo. O Detalhado tem todas as classes, filtros e abas. O
  link guarda o modo; link sem `modo` (os antigos) abre no Detalhado.
- **Abas pelas perguntas:** *O que virou* · *Onde* (mapa) · *Ano a ano* (Sankey,
  linhas, barras, treemap e sunburst) · *Sobre os dados*; no Detalhado também
  *PRODES × MapBiomas* (onde e quanto os mapas discordam), *Cruzamentos* e *Trajetórias*.
- **O que virou pela mesma idade** (leitura do operacional, 22/10/2026): o gráfico
  principal alinha cada ano de desmatamento pelos anos depois dele (o de 2016 no
  MapBiomas 2017, o de 2020 no de 2021), com a opção dos mesmos anos de desmatamento em
  todas as barras (2016-2020, até 5 anos depois); barras por ano do desmatamento; Sankey
  1, 3 e 5 anos depois; "Ficou no mesmo uso?" (3 e 5 anos depois). O desmatamento acumulado
  vem depois, como estoque, seguido de "De onde veio o aumento" (desmatamento novo × uso que o
  MapBiomas mostrou com atraso × troca de uso), para pastagem, agricultura e mosaico.
- **Legendas e números como no explorador:** cores numa linha em cima de cada gráfico, % dentro
  de cada parte da barra e uma tabela embaixo com os números do gráfico (área do PRODES e, em %
  dessa área, cada classe). O gráfico principal também em linhas.
- **Topo como no explorador:** anos do desmatamento PRODES e o mapa do MapBiomas usado
  nos números; filtros em gavetas (Território, Trajetória) e "Filtros aplicados".
- **Filtros de três estados** (+ precisa ter, − não pode ter) nas gavetas: bioma (PRODES
  ou municipal), UF, UF × bioma, AEZ, AEZ × UF × bioma (o território), tipo de trajetória
  e PRODES × MapBiomas.
- **O MapBiomas ainda mostra vegetação, e por quê:** MapBiomas atrasado (o uso aparece
  depois), MapBiomas não confirma o desmatamento (vegetação nativa em todos os anos até
  2025), voltou a aparecer como vegetação (1º ano; 2+ anos) — este último pode ser
  regeneração ou oscilação do mapa. Nas pilhas, o uso fica embaixo e isso em cima.
- **Mapa com linha do tempo:** desmatamento acumulado, só o de cada ano, anos depois
  da supressão, ano do PRODES e onde os mapas discordam; aperte ▶ e clique num ponto
  para ver a trajetória dele. Pixel de ~75 m no zoom máximo.
- Animações (▶), CSV, PNG e link que reabre a mesma tela.

Brasil, desmatamento 2016-2024, **1 ano depois do desmatamento**: 50,5% pastagem, 5,8%
agricultura, 18,5% mosaico de usos, 22,0% ainda vegetação no MapBiomas (15,8% em que o
MapBiomas não confirma o desmatamento e 6,2% em que o uso ainda não apareceu) e 0,83% que
voltou a aparecer como vegetação. Nos desmatamentos de 2016 a 2020, de 1 para 5 anos
depois: pastagem de 48,7% para 53,9%, agricultura de 7,6% para 11,6%, ainda vegetação no
MapBiomas de 26,2% para 17,9%.

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
ano e bioma a bioma. A página confere a si mesma com `?validar` (7 conferências): área
por ano × bioma igual ao PRODES (54/54), colunas do Sankey, quebras e filtros somando o
total, e cada ano de desmatamento inteiro 1 ano depois.

O endereço antigo `/v2/` redireciona para cá. A primeira versão (v1) está no
histórico do repositório.

## Como gerar e testar

Mesmo modelo do [explorador-prodes](https://github.com/gierrejunior/explorador-prodes)
(desde 22/10/2026): a página é `src/explorador_template.html`, versionada aqui, e os
dados (o objeto `D`) entram por `scripts/build.py`.

```
python3 scripts/build.py            # template + dados do index.html publicado -> index.html
python3 scripts/build.py --check    # confere que o index.html sai do template, byte a byte
python3 scripts/build.py --data D.json   # dados novos, do 04_explorador_html.py
npm install && npm test             # testes de build e de navegador (Playwright)
```

O mapa usa WebGL e é testado à parte, pelo `scripts/ferramentas/testa_mapa.mjs` do
projeto. As tiles (`tiles/`) saem do `08_mapa_tiles.py`.
