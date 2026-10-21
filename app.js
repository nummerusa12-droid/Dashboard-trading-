const eur=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(v);
const sgn=v=>(v>0?'+':'')+eur(v);const cls=v=>v>=0?'pos':'neg';
const dt=s=>new Date(s).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'});
function chart(pts){const c=document.getElementById('chart'),w=c.width=c.clientWidth*2,h=c.height=440,x=c.getContext('2d');
 if(pts.length<2)return;const vs=pts.map(p=>p.kontostand),mn=Math.min(...vs),mx=Math.max(...vs),pad=40,r=mx-mn||1;
 const X=i=>pad+i*(w-2*pad)/(pts.length-1),Y=v=>h-pad-(v-mn)/r*(h-2*pad);
 x.strokeStyle='rgba(255,255,255,.07)';x.fillStyle='#7d86a8';x.font='22px sans-serif';
 for(let i=0;i<=4;i++){const v=mn+r*i/4;x.beginPath();x.moveTo(pad,Y(v));x.lineTo(w-pad,Y(v));x.stroke();x.fillText(eur(v),pad+4,Y(v)-6)}
 const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(34,211,238,.35)');g.addColorStop(1,'rgba(34,211,238,0)');
 x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(i),Y(p.kontostand)):x.moveTo(X(i),Y(p.kontostand)));
 x.lineWidth=5;x.strokeStyle='#22d3ee';x.stroke();x.lineTo(X(pts.length-1),h-pad);x.lineTo(X(0),h-pad);x.fillStyle=g;x.fill();}
async function load(){try{const d=await (await fetch('data.json?t='+Date.now())).json();
 document.getElementById('banner').classList.toggle('hidden',!d.beispieldaten);
 document.getElementById('upd').textContent='Aktualisiert: '+dt(d.aktualisiert||Date.now())+' · lädt alle 10 s neu';
 const tot=d.kontostand-d.startkapital,tr=d.trades||[],w=tr.filter(t=>t.pnl>0).length;
 const set=(id,t,c)=>{const e=document.getElementById(id);e.textContent=t;e.className='v '+(c||'')};
 set('k-bal',eur(d.kontostand));set('k-pnl',sgn(tot)+' ('+(tot/d.startkapital*100).toFixed(1).replace('.',',')+' %)',cls(tot));
 set('k-today',sgn(d.pnl_heute||0),cls(d.pnl_heute||0));set('k-win',tr.length?Math.round(w/tr.length*100)+' % ('+w+'/'+tr.length+')':'–');
 chart(d.verlauf||[]);
 document.getElementById('bots').innerHTML=(d.bots||[]).map(b=>`<div class="bot"><div class="n">🤖 ${b.name}</div><div style="margin:8px 0"><span class="dot"></span>${b.status} · <span class="muted">${b.modus||''}</span></div><div>${b.letzte_aktion}</div><div class="muted">${b.zeit?dt(b.zeit):''}</div></div>`).join('');
 const P=d.positionen||[];document.getElementById('pos').innerHTML='<tr><th>Symbol</th><th>Richtung</th><th>Menge</th><th>Einstieg</th><th>Aktuell</th><th>G/V</th></tr>'+(P.length?P.map(p=>{const v=(p.aktuell-p.einstieg)*p.menge*(p.richtung==='short'?-1:1);return `<tr><td>${p.symbol}</td><td>${p.richtung}</td><td>${p.menge}</td><td>${eur(p.einstieg)}</td><td>${eur(p.aktuell)}</td><td class="${cls(v)}">${sgn(v)}</td></tr>`}).join(''):'<tr><td colspan=6 class="muted">Keine offenen Positionen</td></tr>');
 document.getElementById('trades').innerHTML='<tr><th>Zeit</th><th>Bot</th><th>Symbol</th><th>Richtung</th><th>Ein → Aus</th><th>G/V</th></tr>'+tr.slice().sort((a,b)=>new Date(b.zeit)-new Date(a.zeit)).slice(0,20).map(t=>`<tr><td>${dt(t.zeit)}</td><td>${t.bot}</td><td>${t.symbol}</td><td>${t.richtung}</td><td>${eur(t.einstieg)} → ${eur(t.ausstieg)}</td><td class="${cls(t.pnl)}">${sgn(t.pnl)}</td></tr>`).join('');
}catch(e){document.getElementById('upd').textContent='Fehler beim Laden von data.json: '+e}}
load();setInterval(load,10000);
