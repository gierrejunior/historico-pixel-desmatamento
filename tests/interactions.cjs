// Testes de navegador (Playwright), no mesmo modelo do explorador-prodes.
// O mapa usa WebGL e fica no ../scripts/ferramentas/testa_mapa.mjs.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
let browser,server,base;const errors=[];
before(async()=>{base=process.env.HISTORICO_BASE;if(!base){const port=18766;server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:path.resolve(__dirname,'..'),stdio:'ignore'});base=`http://127.0.0.1:${port}/`;for(let i=0;i<50;i++){try{if((await fetch(base,{method:'HEAD'})).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}}
 browser=await chromium.launch();});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(errors,[],'Erros de JavaScript no navegador');});
async function page(query,viewport={width:1600,height:1000}){const p=await browser.newPage({viewport});p.on('pageerror',e=>errors.push(e.message));await p.goto(base+query,{timeout:120000});await p.waitForFunction(()=>document.querySelectorAll('#kpi > *').length>0,null,{timeout:120000});return p;}

test('A página abre com os números do recorte e as abas, sem erro',async()=>{
 const p=await page('');assert.ok(await p.locator('#kpi > *').count()>0);assert.ok(await p.locator('#abas [data-aba]').count()>=6);await p.close();
});

test('Celular sem rolagem lateral',async()=>{
 const p=await page('',{width:390,height:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.close();
});

test('Autoconferência aprovada',async()=>{
 const p=await page('?validar');await p.waitForSelector('#painelValidacao',{timeout:120000});
 const res=await p.evaluate(()=>window.__validacao);assert.ok(res.length>=6);assert.deepEqual(res.filter(r=>!r[1]).map(r=>r[0]),[]);
 assert.match(await p.locator('#painelValidacao').innerText(),/Autoconferência aprovada/);await p.close();
});

test('O que virou: mesma idade, por ano do desmatamento e 1, 3 e 5 anos depois',async()=>{
 const p=await page('');
 assert.match(await p.locator('#rVirou').innerText(),/1 ano depois do desmatamento .* ainda era vegetação no MapBiomas. Com o tempo, nos desmatamentos de 2016 a 2020/s);
 assert.match(await p.locator('#porAnoTit').innerText(),/virou 1 ano depois/);
 assert.ok(await p.locator('#paSvg rect').count()>9);
 assert.match(await p.locator('#idadesTit').innerText(),/1, 3 e 5 anos depois/);
 assert.ok(await p.locator('#siSvg path').count()>0);
 assert.match(await p.locator('#respVirou').textContent(),/Ficou no mesmo uso\?/);
 await p.locator('[data-mesmos="1"]').click();
 assert.match(await p.locator('#adSub').innerText(),/Os mesmos anos de desmatamento em todas as barras: 2016 a 2020/);
 assert.ok(await p.evaluate(()=>paraURL().includes('mi=1')));
 await p.close();
});

test('Um ano de desmatamento só: sem as barras por ano e com o Sankey até 2025',async()=>{
 const p=await page('?f_ano=%2B2022');
 assert.equal(await p.locator('#gPorAno').isVisible(),false);
 assert.equal(await p.locator('#segMesmos').isVisible(),false);
 assert.match(await p.locator('#idadesTit').innerText(),/1, 2 e 3 anos depois/);
 await p.close();
});

test('Link antigo com o nome anterior do tipo continua filtrando',async()=>{
 const p=await page('?f_tipo=%2BVoltou%20a%20ser%20vegeta%C3%A7%C3%A3o');
 assert.match(await p.locator('#fichas').innerText(),/Voltou a aparecer como vegetação/);
 await p.close();
});

test('Simplificado ao abrir; Detalhado pelo botão e pelos links antigos',async()=>{
 const p=await page('');
 assert.equal(await p.evaluate(()=>document.body.dataset.modo),'simples');
 assert.equal(await p.locator('#abas [data-aba="diverge"]').isVisible(),false);
 assert.equal(await p.locator('.gavBtn[data-gav="aez"]').isVisible(),false);
 assert.match(await p.locator('#legPA').textContent(),/Ainda vegetação no MapBiomas/);
 await p.locator('button[data-modo="det"]').click();
 assert.equal(await p.locator('#abas [data-aba="diverge"]').isVisible(),true);
 assert.equal(await p.locator('.gavBtn[data-gav="aez"]').isVisible(),true);
 assert.match(await p.locator('#legPA').textContent(),/MapBiomas atrasado/);
 assert.ok(await p.evaluate(()=>paraURL().includes('modo=det')));
 await p.close();
 const v=await page('?aba=diverge&f_bioma=%2BCerrado');   // link de antes do Simplificado
 assert.equal(await v.evaluate(()=>document.body.dataset.modo),'det');
 assert.equal(await v.locator('.aba[data-aba="diverge"]').isVisible(),true);
 await v.close();
 const s=await page('?modo=simples&aba=diverge');           // aba do Detalhado num link do Simplificado: volta para O que virou
 assert.equal(await s.locator('.aba[data-aba="virou"]').isVisible(),true);
 await s.close();
});

test('Detalhado no celular sem rolagem lateral',async()=>{
 const p=await page('?modo=det',{width:390,height:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.close();
});

test('Foco: a tabela acende o gráfico e o gráfico acende a tabela',async()=>{
 const p=await page('');
 await p.locator('#tabPA tr[data-col="1"] td').first().click(); await p.waitForTimeout(400);
 const op=await p.evaluate(()=>[document.querySelector('#gPorAno g[data-col="0"] rect[data-no]').style.opacity,document.querySelector('#gPorAno g[data-col="1"] rect[data-no]').style.opacity]);
 assert.deepEqual(op,['0.16','']);
 assert.match(await p.locator('#sel_gPorAno').innerText(),/Seleção no gráfico[\s\S]*2017/i);
 await p.locator('#tabAD th[data-no]',{hasText:'Pastagem'}).click(); await p.waitForTimeout(400);
 const no=await p.locator('#tabAD th[data-no]',{hasText:'Pastagem'}).getAttribute('data-no');
 const acesas=await p.evaluate(n=>[...document.querySelectorAll('#gAD rect[data-no]')].filter(r=>r.style.opacity!=='0.16').every(r=>r.dataset.no===n),no);
 assert.equal(acesas,true);
 await p.locator('#gAcum g[data-col="8"] rect[data-no]').first().click(); await p.waitForTimeout(400);
 assert.equal(await p.locator('#tabAC tr[data-col="8"]').getAttribute('class'),'marcada');
 await p.close();
});

test('Foco: duplo clique filtra, Voltar desfaz; o Sankey segue a área',async()=>{
 const p=await page('');
 const pasto=await p.locator('#tabPA th[data-no]',{hasText:'Pastagem'}).getAttribute('data-no');
 await p.locator(`#gPorAno g[data-col="3"] rect[data-no="${pasto}"]`).dblclick(); await p.waitForTimeout(500);
 assert.deepEqual(await p.evaluate(()=>[[...S.f.ano.keys()],S.seguir.conds]),[['2019'],[{t:'k',v:1,nos:[+pasto]}]]);
 assert.match(await p.locator('#fichas').innerText(),/Pastagem 1 ano depois do desmatamento/);
 await p.locator('#voltaFoco').click(); await p.waitForTimeout(300);
 assert.deepEqual(await p.evaluate(()=>[S.f.ano.size,S.seguir]),[0,null]);
 await p.locator(`#gIdades rect[data-col="1"][data-no="${pasto}"]`).dblclick(); await p.waitForTimeout(500);
 const c=await p.evaluate(()=>S.seguir.conds); assert.deepEqual(c,[{t:'k',v:3,nos:[+pasto]}]);
 assert.match(await p.locator('#fichas').innerText(),/Pastagem 3 anos depois do desmatamento/);
 await p.close();
});

test('Foco no link e link antigo do Seguir',async()=>{
 const p=await page('?modo=simples&fc=gPorAno~2.');
 assert.equal(await p.locator('#tabPA tr[data-col="2"]').getAttribute('class'),'marcada');
 await p.close();
 const v=await page('?s=historia:1:4');
 assert.match(await v.locator('#fichas').innerText(),/Pastagem em 2018/);
 await v.close();
});

test('Prévia ao passar o mouse, CSV de cada gráfico e trilha dos filtros pelo gráfico',async()=>{
 const p=await page('');
 const pasto=await p.locator('#tabPA th[data-no]',{hasText:'Pastagem'}).getAttribute('data-no');
 await p.locator(`#legPA .lg[data-no="${pasto}"]`).hover(); await p.waitForTimeout(150);
 assert.equal(await p.evaluate(n=>[...document.querySelectorAll('#gPorAno rect[data-no]')].filter(r=>r.style.opacity!=='0.16').every(r=>r.dataset.no===n),pasto),true);
 assert.equal(await p.evaluate(()=>(FOCO.gPorAno||[]).length),0);
 await p.mouse.move(5,5); await p.waitForTimeout(150);
 assert.equal(await p.evaluate(()=>[...document.querySelectorAll('#gPorAno rect[data-no]')].every(r=>r.style.opacity==='')),true);
 const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('[data-csv="tabPA"]').click()]);
 assert.match(dl.suggestedFilename(),/historico_tabPA_.*\.csv/);
 await p.locator(`#gPorAno g[data-col="3"] rect[data-no="${pasto}"]`).dblclick(); await p.waitForTimeout(500);
 await p.locator('#tabAD tr[data-col="4"] td').first().click(); await p.waitForTimeout(400);
 assert.match(await p.locator('#fichas').innerText(),/Pelo gráfico[\s\S]*Início[\s\S]*2019 · Pastagem 1 ano depois/i);
 await p.locator('#fichas [data-volta="0"]').click(); await p.waitForTimeout(300);
 assert.deepEqual(await p.evaluate(()=>[S.f.ano.size,S.seguir,PILHA.length]),[0,null,0]);
 await p.close();
});

test('Caminhos entre usos embaixo do Sankey: duplo clique segue os dois momentos',async()=>{
 const p=await page('');
 assert.ok(await p.locator('#tabSI tr[data-row]').count()>3);
 const pasto=await p.locator('#tabPA th[data-no]',{hasText:'Pastagem'}).getAttribute('data-no');
 const agri=await p.locator('#tabPA th[data-no]',{hasText:'Agricultura'}).getAttribute('data-no');
 await p.locator(`#tabSI tr[data-row="${pasto}"] td[data-no="${agri}"]`).dblclick(); await p.waitForTimeout(500);
 assert.deepEqual(await p.evaluate(()=>S.seguir.conds),[{t:'k',v:1,nos:[+pasto]},{t:'k',v:5,nos:[+agri]}]);
 await p.close();
});

test('Ano a ano: Configurar análise e foco com filtro também nas barras e no treemap',async()=>{
 const p=await page('?modo=det&aba=tempo&g=treemap&e=bioma');
 assert.equal(await p.locator('details.cfgAnalise').getAttribute('open'),'');
 const r=p.locator('#gWrap g[data-col="0"] rect[data-no]').first(); const k=await p.locator('#gWrap g[data-col="0"]').getAttribute('data-selk');
 await r.dblclick(); await p.waitForTimeout(500);
 assert.deepEqual(await p.evaluate(()=>[...S.f.bioma.keys()]),[k]); assert.ok(await p.evaluate(()=>S.seguir&&S.seguir.conds.length===1));
 await p.close();
 const b=await page('?modo=det&aba=tempo&g=barras');
 await b.locator('#gWrap g[data-col="2"] rect[data-no]').first().click(); await b.waitForTimeout(400);
 assert.match(await b.locator('#sel_gWrap').innerText(),/Seleção no gráfico/i);
 await b.close();
});
