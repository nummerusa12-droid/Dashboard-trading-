(async()=>{
const d=await (await fetch('bots.json')).json();
let geld=null;try{for(const u of['./data.json','../data.json']){const r=await fetch(u);if(r.ok){geld=await r.json();break}}}catch(e){}
const app=document.getElementById('app');let n=0,a=0,i=0;
for(const g of d.gruppen){const s=document.createElement('section');s.className='gruppe';s.style.setProperty('--c',g.farbe);
s.innerHTML=`<h2><i></i>${g.name} <small style="color:#6b7280">(${g.bots.length})</small></h2><div class="grid"></div>`;
for(const b of g.bots){n++;if(b.status==='aktiv')a++;const c=document.createElement('div');c.className='card';c.style.animationDelay=(i++*50)+'ms';
let money='';if(b.spielgeld&&geld&&geld.kontostand!=null){const p=geld.kontostand-(geld.startkapital||0);money=`<div class="geld">${geld.kontostand.toLocaleString('de-DE',{style:'currency',currency:'EUR'})} <small>Spielgeld · ${p>=0?'+':''}${p.toFixed(2).replace('.',',')} €</small></div>`}
c.innerHTML=`<div class="top"><div class="ava">${b.emoji}</div><div><div class="name">${b.name}${b.lead?'<span class="lead">Lead</span>':''}</div><span class="pill ${b.status}"><b></b>${b.status==='aktiv'?'Aktiv':'Bereit'}</span></div></div>
<div class="desc">${b.beschreibung}</div><div class="macht">Macht gerade: <em>${b.macht}</em></div>${money}
<div class="det"><b>Gruppe:</b> ${g.name}<br><b>Status:</b> ${b.status}${b.spielgeld&&geld?`<br><b>Aktualisiert:</b> ${new Date(geld.aktualisiert).toLocaleString('de-DE')}<br><b>Trades:</b> ${(geld.trades||[]).length}`:''}<br><i>Zum Chatten den Bot in der App öffnen.</i></div>`;
c.onclick=()=>c.classList.toggle('open');s.querySelector('.grid').appendChild(c)}app.appendChild(s)}
document.getElementById('stats').innerHTML=`<span class="stat">🤖 ${n} Bots</span><span class="stat">🟢 ${a} aktiv</span><span class="stat">📦 ${d.gruppen.length} Teams</span>`;
})();
