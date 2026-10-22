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
