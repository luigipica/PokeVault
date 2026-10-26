(function(){
const E=id=>document.getElementById(id), box=document.createElement('div');
box.className='panel';box.innerHTML='<h2>Esplora la collezione</h2><div class="actions"><button class="secondary sm" id="cvAll">Tutte</button><button class="secondary sm" id="cvSets">Per espansione</button><button class="secondary sm" id="cvRars">Per rarità</button></div><label>Espansione</label><select id="cvSet"><option value="">Tutte</option></select><label>Rarità</label><select id="cvRarity"><option value="">Tutte</option></select><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><label>Prezzo min. €</label><input id="cvMin" type="number" min="0" step=".01" placeholder="0"></div><div><label>Prezzo max. €</label><input id="cvMax" type="number" min="0" step=".01" placeholder="Illimitato"></div></div><label>Ordina per</label><select id="cvSort"><option value="az">Nome A–Z</option><option value="za">Nome Z–A</option><option value="expensive">Prezzo più alto</option><option value="cheap">Prezzo più basso</option><option value="total">Valore totale</option><option value="qty">Quantità</option><option value="set">Espansione</option><option value="rarity">Rarità</option></select><label>Vista</label><select id="cvView"><option value="list">Elenco</option><option value="grid">Griglia</option></select><div class="actions"><button class="secondary sm" id="cvReset">Azzera filtri</button></div><p class="small" id="cvSummary"></p>';
E('collection').insertBefore(box,E('myCards'));
let mode='all', collator=new Intl.Collator('it',{numeric:true,sensitivity:'base'});
const money=x=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(x||0);
const price=x=>Number(x.price)||0, qty=x=>Number(x.qty)||0;
function options(id, values){let el=E(id),selected=el.value;el.replaceChildren(new Option('Tutte',''));values.forEach(v=>el.add(new Option(v,v)));el.value=values.includes(selected)?selected:''}
function selectMode(m){mode=m;draw();}
E('cvAll').onclick=()=>selectMode('all');E('cvSets').onclick=()=>selectMode('set');E('cvRars').onclick=()=>selectMode('rarity');
for(let id of ['cvSet','cvRarity','cvMin','cvMax','cvSort','cvView'])E(id).addEventListener('input',()=>draw());
E('cvReset').onclick=()=>{E('filter').value='';for(let id of ['cvSet','cvRarity','cvMin','cvMax'])E(id).value='';E('cvSort').value='az';selectMode('all')};
function card(c){
let el=document.createElement('div');el.className='cardrow';if(E('cvView').value==='grid'){el.style.flexDirection='column';el.style.alignItems='stretch'}
let image=document.createElement('img');image.loading='lazy';image.alt=c.name;image.src=c.image?c.image+'/low.webp':'';image.onerror=()=>image.style.display='none';
if(E('cvView').value==='grid'){image.style.width='100%';image.style.height='170px'}
let body=document.createElement('div');body.style.minWidth='0';
let title=document.createElement('strong');title.textContent=c.name;
let info=document.createElement('div');info.className='small';info.textContent=[c.set,c.id,c.rarity||'Rarità non specificata',c.variant,c.condition].filter(Boolean).join(' · ');
let cost=document.createElement('div');cost.className='money';cost.textContent=price(c)?money(price(c))+' × '+qty(c)+' = '+money(price(c)*qty(c)):'Prezzo non disponibile';
let buttons=document.createElement('div');buttons.className='actions';
for(let [symbol,kind] of [['−','minus'],['+','plus'],['Rimuovi','delete']]){
let b=document.createElement('button');b.className=kind==='delete'?'danger sm':'secondary sm';b.textContent=symbol;b.onclick=()=>{let i=records.indexOf(c);if(i<0)return;if(kind==='delete'){if(!confirm('Rimuovere questa voce?'))return;records.splice(i,1)}else if(kind==='minus'){records[i].qty--;if(records[i].qty<1)records.splice(i,1)}else records[i].qty++;save();};buttons.append(b)}
body.append(title,info,cost,buttons);el.append(image,body);return el
}
const oldRender=render;
render=function(){oldRender();draw()};
function draw(){
let sets=[...new Set(records.map(x=>x.set||'Senza espansione'))].sort(collator.compare);
let rarities=[...new Set(records.map(x=>x.rarity||'Non specificata'))].sort(collator.compare);
options('cvSet',sets);options('cvRarity',rarities);
let query=E('filter').value.toLocaleLowerCase('it'), min=E('cvMin').value===''?null:Number(E('cvMin').value), max=E('cvMax').value===''?null:Number(E('cvMax').value);
let list=records.filter(c=>[c.name,c.set,c.id,c.rarity].some(x=>String(x||'').toLocaleLowerCase('it').includes(query))).filter(c=>(!E('cvSet').value||(c.set||'Senza espansione')===E('cvSet').value)&&(!E('cvRarity').value||(c.rarity||'Non specificata')===E('cvRarity').value)&&(min===null||price(c)>=min)&&(max===null||price(c)<=max));
let sort=E('cvSort').value;list.sort((a,b)=>sort==='az'?collator.compare(a.name,b.name):sort==='za'?collator.compare(b.name,a.name):sort==='expensive'?price(b)-price(a):sort==='cheap'?price(a)-price(b):sort==='total'?price(b)*qty(b)-price(a)*qty(a):sort==='qty'?qty(b)-qty(a):sort==='set'?collator.compare(a.set||'',b.set||''):collator.compare(a.rarity||'',b.rarity||''));
E('cvSummary').textContent=list.reduce((s,x)=>s+qty(x),0)+' carte · '+list.length+' voci · '+money(list.reduce((s,x)=>s+price(x)*qty(x),0));
const root=E('myCards');root.replaceChildren();root.style.gridTemplateColumns=mode==='all'&&E('cvView').value==='grid'?'repeat(2,minmax(0,1fr))':'1fr';if(!list.length){root.textContent='Nessuna carta corrisponde ai filtri.';return}
if(mode==='all'){list.forEach(c=>root.append(card(c)));return}
let groups=new Map();for(let c of list){let k=mode==='set'?(c.set||'Senza espansione'):(c.rarity||'Non specificata');if(!groups.has(k))groups.set(k,[]);groups.get(k).push(c)}
for(let [key,cards] of [...groups].sort((a,b)=>collator.compare(a[0],b[0]))){let section=document.createElement('details');section.open=true;section.className='panel';let summary=document.createElement('summary');summary.textContent=key+' · '+cards.reduce((s,x)=>s+qty(x),0)+' carte · '+money(cards.reduce((s,x)=>s+price(x)*qty(x),0));summary.style='font-weight:bold;cursor:pointer';let contents=document.createElement('div');contents.style='display:grid;gap:9px;margin-top:12px;grid-template-columns:'+(E('cvView').value==='grid'?'repeat(2,minmax(0,1fr))':'1fr');cards.forEach(c=>contents.append(card(c)));section.append(summary,contents);root.append(section)}
}
draw();
})();