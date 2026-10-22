# O que acontece com a terra depois de desmatada

Página única e autocontida que acompanha cada pixel de 10 m desmatado segundo o
PRODES entre 2016 e 2024, ano a ano, no MapBiomas 10 m (coleção 4) de 2017 a
2025. Filtros por ano do desmatamento, bioma, UF e zona agroecológica (AEZ).

**Abrir:** https://gierrejunior.github.io/historico-pixel-desmatamento/ — acrescente `?validar`
ao endereço para a página conferir a si mesma contra o PRODES rasterizado.

## O que tem na página

O ponto de partida é o PRODES: pela definição dele, toda esta área era vegetação nativa
até a supressão. O MapBiomas é a lente do que veio depois.

- **Abas pelas perguntas:** *O que virou* (desmatamento acumulado ano a ano, antes e
  depois da supressão, matriz) · *PRODES × MapBiomas* (onde e quanto os mapas discordam) ·
  *Onde* (mapa) · *Ano a ano* (Sankey, linhas, barras, treemap e sunburst) ·
  *Cruzamentos* · *Trajetórias* · *Sobre os dados*.
- **Filtros de três estados** (+ precisa ter, − não pode ter): ano do desmatamento,
  bioma (PRODES ou municipal), UF, UF × bioma, AEZ, AEZ × UF × bioma (o território)
  e tipo de trajetória.
- **Defasagem montável:** o MapBiomas leva 1 a 2 anos para ver a supressão do PRODES;
  a página deixa olhar o uso no ano da supressão, 1, 2, 3... anos depois (padrão: 1).
- **Vegetação nativa separada pelo que aconteceu com ela:** MapBiomas ainda não viu a
  supressão (o uso aparece depois), MapBiomas não confirma o desmatamento (vegetação
  nativa em todos os anos até 2025), voltou a ser vegetação (1º ano; 2+ anos).
- **Mapa com linha do tempo:** desmatamento acumulado, só o de cada ano, anos depois
  da supressão, ano do PRODES e onde os mapas discordam; aperte ▶ e clique num ponto
  para ver a trajetória dele. Pixel de ~75 m no zoom máximo.
- Animações (▶), CSV, PNG e link que reabre a mesma tela.

Brasil, desmatamento 2016-2024, **1 ano depois da supressão**: 50,5% pastagem, 5,8%
agricultura, 22,8% ainda vegetação nativa no MapBiomas — 15,8% em que o MapBiomas não
confirma o desmatamento (desacordo entre os mapas), e o resto em que o uso ainda não
apareceu ou que voltou a ser vegetação.

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
