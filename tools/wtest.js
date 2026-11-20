// ---------- WEEKLY OLYMPIAD TEST ----------
const fmtD=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
function weekKey(d){const x=d?new Date(d+'T00:00:00'):new Date();x.setDate(x.getDate()-(x.getDay()+6)%7);return fmtD(x)} // Monday of the week
function weekDays(wk){const x=new Date(wk+'T00:00:00');return [0,1,2,3,4,5,6].map(i=>{const y=new Date(x);y.setDate(x.getDate()+i);return fmtD(y)})}
const WT_OPEN=()=>[0,6].includes(new Date().getDay()); // Saturday & Sunday
const wtDone=()=>(prog.wt||{})[weekKey()];
function WT_SPEC(){return WHO==='aaranya'?
  {mins:60,secs:[{k:'lr',n:'Logical Reasoning',q:10,m:1},{k:'mr',n:'Mathematical Reasoning',q:10,m:1},{k:'wk',n:'This week\'s topics',q:10,m:1},{k:'ach',n:'Achievers — think harder!',q:5,m:2}]}:
  {mins:60,secs:[{k:'lr',n:'Logical Reasoning',q:15,m:1},{k:'mr',n:'Mathematical Reasoning',q:20,m:1},{k:'wk',n:'This week\'s topics',q:10,m:1},{k:'ach',n:'Achievers',q:5,m:3}]}}

// --- question builders ---
function mcqNum(text,ans,steps,explain){ans=Number(ans);const ds=shuffle([1,-1,2,-2,10,-10,5,-5,3,-3,ans>=20?Math.round(ans/10):4,ans>=300?100:6,ans>=300?-100:-6]);const o=[ans];
  for(const d of ds){const v=ans+d;if(v>=0&&!o.includes(v))o.push(v);if(o.length===4)break}
  const opts=shuffle(o);return{text,opts:opts.map(String),ans:opts.indexOf(ans),steps,explain:explain||''}}
function mcqStr(text,ans,wrongs,explain,steps){const w=[...new Set(wrongs.filter(x=>x!==ans))].slice(0,3);const opts=shuffle([ans].concat(w));return{text,opts,ans:opts.indexOf(ans),explain,steps}}
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ',DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const NAMES=['Riya','Kabir','Meera','Arjun','Zoya','Ishaan','Anika','Vihaan','Tara','Dev'];
const shiftW=(w,s)=>w.split('').map(c=>ABC[(ABC.indexOf(c)+s+26)%26]).join('');
function genLR(hard){
  const A=!hard,t=rint(0,A?6:9),nm=pick(NAMES);
  if(t===0){ // number series
    let a,d,seq,ans,ex;
    const kind=A?rint(0,1):rint(0,4);
    if(kind===0){a=rint(1,A?20:60);d=A?pick([2,3,4,5,10]):pick([-7,-6,6,7,8,9,11,12,13]);if(d<0)a+=60;seq=[0,1,2,3,4].map(i=>a+i*d);ans=a+5*d;ex='Each number '+(d>0?'goes up':'goes down')+' by '+Math.abs(d)+'. So '+seq[4]+(d>0?' + ':' − ')+Math.abs(d)+' = '+ans+'.'}
    else if(kind===1){a=rint(1,A?3:5);const r=A?2:pick([2,3]);seq=[0,1,2,3,4].map(i=>a*r**i);ans=a*r**5;ex='Each number is '+(r===2?'doubled':'multiplied by '+r)+'. So '+seq[4]+' × '+r+' = '+ans+'.'}
    else if(kind===2){a=rint(1,6);seq=[0,1,2,3,4].map(i=>(a+i)**2);ans=(a+5)**2;ex='These are square numbers: '+[0,1,2,3,4].map(i=>(a+i)+'×'+(a+i)).join(', ')+'. Next is '+(a+5)+'×'+(a+5)+' = '+ans+'.'}
    else if(kind===3){a=rint(2,20);const g0=rint(1,4),st=pick([1,2]);seq=[a];for(let i=0;i<4;i++)seq.push(seq[i]+g0+i*st);ans=seq[4]+g0+4*st;ex='The gaps grow by '+st+': +'+[0,1,2,3].map(i=>g0+i*st).join(', +')+'. The next gap is +'+(g0+4*st)+', so '+seq[4]+' + '+(g0+4*st)+' = '+ans+'.'}
    else{a=rint(5,30);const p=rint(2,9),q=rint(1,9);seq=[a,a+p,a+p+q,a+2*p+q,a+2*p+2*q];ans=a+3*p+2*q;ex='The pattern alternates: +'+p+', +'+q+', +'+p+', +'+q+'. Next is +'+p+': '+seq[4]+' + '+p+' = '+ans+'.'}
    return mcqNum('What comes next?  '+seq.join(', ')+', ?',ans,null,ex)}
  if(t===1){ // letter series
    const s=A?pick([1,2]):pick([2,3,4,5]),st=rint(0,25-5*s);const seq=[0,1,2,3].map(i=>ABC[st+i*s]),ans=ABC[st+4*s];
    return mcqStr('What comes next?  '+seq.join(', ')+', ?',ans,[ABC[st+4*s+1],ABC[st+4*s-1],ABC[st+4*s+2],ABC[st+4*s-2],ABC[(st+4*s+3)%26]].filter(Boolean),'Each letter jumps '+s+' place'+(s>1?'s':'')+' forward in the alphabet: '+seq[3]+' → '+ans+'.')}
  if(t===2){ // coding-decoding
    const W=A?['CAT','DOG','SUN','PEN','BOX','CUP','HEN','MAP','JAR','BUS','FAN','KEY','RAT','BAG']:['RIVER','PLANT','TIGER','CLOUD','BRAIN','MANGO','CHAIR','SMILE','LIGHT','OCEAN','STONE','HONEY'];
    const [w1,w2]=shuffle(W).slice(0,2),s=A?1:pick([1,2,3,-1,-2]);const ans=shiftW(w2,s);
    return mcqStr('If '+w1+' is written as '+shiftW(w1,s)+', how is '+w2+' written?',ans,[shiftW(w2,s+1),shiftW(w2,s-1||-1),shiftW(w2,-s),w2.split('').reverse().join('')],
      'Each letter moves '+Math.abs(s)+' place'+(Math.abs(s)>1?'s':'')+' '+(s>0?'forward':'back')+' in the alphabet ('+w1[0]+' → '+shiftW(w1[0],s)+'). Do the same to '+w2+': '+ans+'.')}
  if(t===3){ // ranking
    if(A||Math.random()<.5){const N=rint(A?6:15,A?15:45),K=rint(2,N-1);return mcqNum('In a row of '+N+' children, '+nm+' is '+ord(K)+' from the left. What is '+nm+'\'s position from the right?',N-K+1,null,'Children to the right of '+nm+' = '+N+' − '+K+' = '+(N-K)+'. Add 1 for '+nm+': '+(N-K+1)+'.')}
    const L=rint(5,25),R=rint(5,25);return mcqNum(nm+' is '+ord(L)+' from the left and '+ord(R)+' from the right in a row. How many children are in the row?',L+R-1,null,'Add both positions and subtract 1, because '+nm+' was counted twice: '+L+' + '+R+' − 1 = '+(L+R-1)+'.')}
  if(t===4){ // days
    const d0=rint(0,6),n=A?rint(2,12):rint(15,120),ans=DAYS[(d0+n)%7];
    return mcqStr('Today is '+DAYS[d0]+'. Which day of the week will it be after '+n+' days?',ans,[DAYS[(d0+n+1)%7],DAYS[(d0+n+6)%7],DAYS[(d0+n+2)%7]],
      n>=7?'Every 7 days the same day comes back. '+n+' ÷ 7 leaves remainder '+(n%7)+', so move '+(n%7)+' day'+(n%7===1?'':'s')+' on from '+DAYS[d0]+': '+ans+'.':'Count '+n+' days on from '+DAYS[d0]+': '+ans+'.')}
  if(t===5){ // odd one out
    let set,odd,why;const k=A?rint(0,1):rint(0,3);
    if(k===0){const ev=shuffle([...Array(20)].map((_,i)=>2*i+12)).slice(0,3);odd=2*rint(6,25)+1;set=ev;why='All the others are even numbers; '+odd+' is odd.'}
    else if(k===1){const m=A?5:pick([6,7,8,9]);set=shuffle([...Array(12)].map((_,i)=>m*(i+2))).slice(0,3);odd=m*rint(2,13)+rint(1,m-1);why='The others are all in the '+m+' times table; '+odd+' is not.'}
    else if(k===2){const P=[11,13,17,19,23,29,31,37,41,43,47];set=shuffle(P).slice(0,3);odd=pick([21,27,33,39,49,51,57]);why='The others are prime numbers; '+odd+' is not prime ('+odd+' = '+factor(odd)+').'}
    else{set=shuffle([16,25,36,49,64,81,100,121,144]).slice(0,3);odd=pick([18,24,45,50,72,90]);why='The others are square numbers ('+set.map(x=>Math.sqrt(x)+'×'+Math.sqrt(x)).join(', ')+'); '+odd+' is not.'}
    const opts=shuffle(set.concat([odd]));return{text:'Which is the odd one out:  '+opts.join(', ')+' ?',opts:opts.map(String),ans:opts.indexOf(odd),explain:why}}
  if(t===6){ // directions
    const D=['North','East','South','West'],st=rint(0,3),turns=[...Array(A?2:rint(3,4))].map(()=>pick(['right','left']));let c=st;turns.forEach(x=>c=(c+(x==='right'?1:3))%4);
    return mcqStr(nm+' is facing '+D[st]+'. '+nm+' turns '+turns.join(', then ')+'. Which way is '+nm+' facing now?',D[c],D.filter(x=>x!==D[c]),
      'A right turn goes clockwise (North → East → South → West); a left turn goes the other way. Start at '+D[st]+' → '+(()=>{let q=st;return turns.map(x=>{q=(q+(x==='right'?1:3))%4;return D[q]+' ('+x+')'}).join(' → ')})()+'.')}
  if(t===7){ // analogy
    const k=rint(0,1);if(k===0){const a=rint(2,9),b=rint(3,12);return mcqNum(a+' : '+a*a+'  ::  '+b+' : ?',b*b,null,a*a+' is '+a+' × '+a+'. So '+b+' × '+b+' = '+b*b+'.')}
    const a=rint(2,5),b=rint(3,9);return mcqNum(a+' : '+a**3+'  ::  '+b+' : ?',b**3,null,a**3+' is '+a+' × '+a+' × '+a+' (a cube). So '+b+' × '+b+' × '+b+' = '+b**3+'.')}
  if(t===8){ // alphabet position
    const p=rint(3,12),q=rint(3,12),ans=ABC[p+q-1];return mcqStr('In the English alphabet, which letter is '+ord(q)+' to the right of the '+ord(p)+' letter from the left?',ans,[ABC[p+q],ABC[p+q-2],ABC[p+q+1]],'The '+ord(p)+' letter is '+ABC[p-1]+'. Count '+q+' more to the right: position '+p+' + '+q+' = '+(p+q)+', which is '+ans+'.')}
  // clock (hard)
  const h=rint(1,11),mm=pick([0,15,30]);const ang=Math.abs(30*h-5.5*mm),a2=Math.min(ang,360-ang);
  return mcqNum('What is the smaller angle between the hour and minute hands at '+h+':'+String(mm).padStart(2,'0')+'? (in degrees)',a2,['The minute hand is at '+mm*6+'°.','The hour hand is at '+h+' × 30 + '+mm+' × 0.5 = '+(30*h+mm/2)+'°.','Difference = '+ang+'°'+(ang>180?', and the smaller side is 360 − '+ang+' = '+a2+'°.':'.')])
}
function ord(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])}
function factor(n){for(let i=2;i<n;i++)if(n%i===0)return i+' × '+n/i;return String(n)}
function genWord(hard){
  const nm=pick(NAMES),t=rint(0,hard?5:3);
  if(t===0){const p=hard?rint(12,85):rint(3,15),n=hard?rint(6,24):rint(2,9);return mcqNum('One notebook costs ₹'+p+'. How much do '+n+' notebooks cost?',p*n,hMul(p,n).concat(['So '+n+' notebooks cost ₹'+p*n+'.']))}
  if(t===1){const a=hard?rint(500,2000):rint(50,200),b=rint(10,Math.floor(a/3)),c=rint(5,Math.floor(a/3));return mcqNum(nm+' had ₹'+a+'. '+nm+' spent ₹'+b+' on a book and ₹'+c+' on a snack. How much money is left?',a-b-c,['Total spent = '+b+' + '+c+' = '+(b+c)+'.','Money left = '+a+' − '+(b+c)+' = '+(a-b-c)+'.'])}
  if(t===2){const h=rint(1,10),m=pick([0,10,15,20,30,40,45]),d=hard?rint(65,170):pick([20,30,40,45,50]);const tot=h*60+m+d,eh=Math.floor(tot/60),em=tot%60;const f=(x,y)=>((x-1)%12+1)+':'+String(y).padStart(2,'0');
    return mcqStr('A show starts at '+f(h,m)+' and lasts '+d+' minutes. At what time does it end?',f(eh,em),[f(eh,(em+10)%60),f(eh+1,em),f(eh-1,em),f(eh,(em+50)%60)],'',[d>=60?d+' minutes = '+Math.floor(d/60)+' hour '+(d%60)+' minutes.':'Add '+d+' minutes to '+f(h,m)+'.','So the show ends at '+f(eh,em)+'.'])}
  if(t===3){const per=hard?rint(6,15):rint(3,8),n=hard?rint(12,40):rint(3,9);return mcqNum('A box holds '+per+' laddoos. How many boxes are needed for '+per*n+' laddoos?',n,hDiv(per*n,per))}
  if(t===4){const P=pick([200,400,500,800,1200,1500,2000]),d=pick([10,20,25,30,40]);return mcqNum('A bag costs ₹'+P+'. The shop gives a '+d+'% discount. What is the sale price?',P-P*d/100,hPct(d,P).concat(['Sale price = '+P+' − '+P*d/100+' = ₹'+(P-P*d/100)+'.']))}
  const s=rint(30,80),t1=rint(2,5),t2=rint(3,8);return mcqNum('A train covers '+s*t1+' km in '+t1+' hours. At the same speed, how far does it go in '+t2+' hours?',s*t2,['Speed = '+s*t1+' ÷ '+t1+' = '+s+' km per hour.','Distance = '+s+' × '+t2+' = '+s*t2+' km.'])
}
function genMR(hard){const q=sprintQ(hard?pick([3,4,4]):pick([1,1,2]));return mcqNum(q.text.replace('→  x','→ x = ?')+(/[=→]/.test(q.text)?'':' = ?'),q.ans,q.steps)}
function olyItem(i){const q=OLY[i];const o=shuffle([0,1,2,3]);return{id:i,cat:q.c,hard:q.d===2,text:q.q,opts:o.map(k=>q.o[k]),ans:o.indexOf(q.a),explain:q.e}}

function buildWeeklyTest(){
  const S=WT_SPEC(),A=WHO==='aaranya',used=new Set(),pool=quizPool(),wkDays=weekDays(weekKey());
  const wrongSet=new Set(prog.wrong||[]),weekIds=new Set();wkDays.forEach(d=>((prog.dqh||{})[d]||[]).forEach(i=>weekIds.add(i)));
  const rank=i=>(wrongSet.has(i)?0:weekIds.has(i)?1:!prog.seen[i]?2:3)+Math.random()*.5;
  const take=(ids,k)=>{const out=ids.filter(i=>!used.has(i)).sort((a,b)=>rank(a)-rank(b)).slice(0,k);out.forEach(i=>used.add(i));return out.map(olyItem)};
  const fill=(arr,k,gen)=>{let g=0;while(arr.length<k&&g++<200){const x=gen();if(!arr.some(y=>y.text===x.text))arr.push(x)}return arr};
  const out=[];
  S.secs.forEach(sec=>{let qs=[];
    if(sec.k==='lr'){qs=take(pool.filter(i=>OLY[i].c==='Reasoning'&&!OLY[i].d),Math.round(sec.q/3));fill(qs,sec.q,()=>genLR(!A))}
    if(sec.k==='mr'){qs=take(pool.filter(i=>OLY[i].c==='Maths'&&!OLY[i].d),Math.round(sec.q*0.4));fill(qs,qs.length+Math.ceil((sec.q-qs.length)/2),()=>genWord(!A));fill(qs,sec.q,()=>genMR(!A))}
    if(sec.k==='wk'){const gk=pool.filter(i=>!['Maths','Reasoning'].includes(OLY[i].c)&&(A||true));
      const inWeek=gk.filter(i=>weekIds.has(i)||wrongSet.has(i));qs=take(inWeek.length>=sec.q?inWeek:gk,sec.q);if(qs.length<sec.q)qs=qs.concat(take(gk,sec.q-qs.length))}
    if(sec.k==='ach'){if(A){qs=take(pool.filter(i=>OLY[i].c==='Maths'&&OLY[i].y),2);fill(qs,4,()=>genWord(false));fill(qs,sec.q,()=>{const g=genLR(true);return g})}
      else{qs=take(OLY.map((q,i)=>i).filter(i=>OLY[i].d===2&&['Maths','Reasoning'].includes(OLY[i].c)),3);fill(qs,sec.q,()=>{if(Math.random()<.5)return genWord(true);const q=sprintQ(4);return mcqNum(q.text.replace('→  x','→ x = ?')+(/[=→]/.test(q.text)?'':' = ?'),q.ans,q.steps)})}}
    qs=sec.k==='wk'?qs:shuffle(qs);qs.forEach(q=>{q.sec=sec.k;out.push(q)})});
  return{wk:weekKey(),qs:out,a:out.map(()=>-1),f:out.map(()=>0),i:0,el:0,start:Date.now()};
}

let WTI=null;
function wtSecOf(i){const S=WT_SPEC();let c=0;for(const s of S.secs){if(i<c+s.q)return{s,first:c};c+=s.q}return{s:S.secs[S.secs.length-1],first:0}}
function openWeeklyTest(){stopAll();show('testView');renderTestHome()}
function renderTestHome(){
  const S=WT_SPEC(),tq=S.secs.reduce((a,s)=>a+s.q,0),tm=S.secs.reduce((a,s)=>a+s.q*s.m,0),done=wtDone(),cur=prog.wtCur&&prog.wtCur.wk===weekKey()?prog.wtCur:null;
  const hist=Object.keys(prog.wt||{}).sort().reverse().slice(0,6);
  let h='<div class="card"><h2>📋 Weekly Olympiad Test</h2>';
  if(done)h+='<p class="tip">✅ Done this week: <b>'+done.s+' / '+done.m+'</b> ('+done.p+'%). A new test opens next Saturday.</p><button class="btn" id="wtRev" style="width:100%">🔎 See my answers & explanations</button>';
  else if(cur)h+='<p class="tip">You have a test in progress: '+cur.a.filter(x=>x>=0).length+' of '+cur.qs.length+' answered, '+Math.max(0,Math.ceil((S.mins*60-cur.el)/60))+' minutes left.</p><button class="btn" id="wtGo" style="width:100%">▶ Carry on</button>';
  else if(!WT_OPEN())h+='<p class="tip">🗓️ The test opens on <b>Saturday and Sunday</b>. During the week, your daily quizzes get you ready — the test wraps up the week.</p>';
  else h+='<p>Just like the real Olympiad: <b>'+tq+' questions · '+tm+' marks · '+S.mins+' minutes</b>. No hints during the test — you can go back, change answers and 🚩 flag questions to check later. Explanations come at the end.</p><button class="btn" id="wtGo" style="width:100%">▶ Start the test</button>';
  h+='<h3>Sections</h3>'+S.secs.map((s,i)=>'<div class="mission"><span class="ic">'+(i+1)+'</span><div class="tx">'+s.n+'<span style="float:right">'+s.q+' Q × '+s.m+' mark'+(s.m>1?'s':'')+'</span></div></div>').join('');
  if(hist.length)h+='<h3>📈 My results</h3>'+hist.map(k=>{const r=prog.wt[k];return '<div class="mission"><span class="ic">'+(r.p>=80?'🏆':r.p>=60?'🌟':'💪')+'</span><div class="tx">Week of '+shortDay(k)+'<span style="float:right">'+r.s+'/'+r.m+' · '+r.p+'%</span><div class="mb"><i style="width:'+r.p+'%;background:'+(r.p>=80?'#2fbf71':r.p>=50?'#ffb020':'#ff5d5d')+'"></i></div></div></div>'}).join('');
  h+='<button class="btn alt" data-back="brain" style="width:100%;margin-top:10px">⬅ Back</button></div>';
  $('testBody').innerHTML=h;
  if($('wtGo'))$('wtGo').onclick=()=>{if(!prog.wtCur||prog.wtCur.wk!==weekKey()){prog.wtCur=buildWeeklyTest();save()}runTest()};
  if($('wtRev'))$('wtRev').onclick=()=>renderTestResult(prog.wtRev);
}
function runTest(){
  const S=WT_SPEC(),C=prog.wtCur;show('testView');
  if(WTI)clearInterval(WTI);
  WTI=setInterval(()=>{if($('testView').classList.contains('hidden')||document.visibilityState!=='visible'||!prog.wtCur)return;C.el++;if(C.el%15===0)save();
    const left=S.mins*60-C.el;const t=$('wtTime');if(t){t.textContent='⏱ '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0');t.style.color=left<300?'#d64545':''}
    if(left<=0)submitTest(true)},1000);
  drawTestQ();
}
function drawTestQ(){
  const C=prog.wtCur,i=C.i,q=C.qs[i],{s,first}=wtSecOf(i),left=WT_SPEC().mins*60-C.el;
  let h='<div class="card"><div class="qbar"><span>Section '+(WT_SPEC().secs.findIndex(x=>x.k===s.k)+1)+': '+s.n+'</span><span id="wtTime">⏱ '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0')+'</span></div>'+
    '<p style="opacity:.7;margin:4px 0">Question '+(i+1)+' of '+C.qs.length+' · '+s.m+' mark'+(s.m>1?'s':'')+(C.f[i]?' · 🚩 flagged':'')+'</p>'+
    '<h3 style="white-space:pre-line">'+esc(q.text)+'</h3><div id="wtOpts">'+q.opts.map((o,k)=>'<button class="opt'+(C.a[i]===k?' picked':'')+'" data-k="'+k+'">'+String.fromCharCode(65+k)+'.  '+esc(o)+'</button>').join('')+'</div>'+
    '<div class="row" style="margin-top:8px"><button class="btn alt" id="wtPrev"'+(i?'':' disabled')+'>⬅</button><button class="btn alt" id="wtFlag">'+(C.f[i]?'Unflag':'🚩 Flag')+'</button><button class="btn" id="wtNext">'+(i<C.qs.length-1?'Next ➡':'Review')+'</button></div>'+
    '<div class="wtpal">'+C.qs.map((_,j)=>'<button data-j="'+j+'" class="'+(C.a[j]>=0?'ans ':'')+(C.f[j]?'flg ':'')+(j===i?'cur':'')+'">'+(j+1)+'</button>').join('')+'</div>'+
    '<p style="font-size:.8rem;opacity:.7;margin:6px 0">Answered '+C.a.filter(x=>x>=0).length+' / '+C.qs.length+'. No negative marking — answer every question!</p>'+
    '<div class="row"><button class="btn alt" id="wtPause">⏸ Save & leave</button><button class="btn" id="wtSubmit">✅ Submit test</button></div></div>';
  $('testBody').innerHTML=h;
  document.querySelectorAll('#wtOpts .opt').forEach(b=>b.onclick=()=>{C.a[i]=+b.dataset.k;SND.tick();save();if(i<C.qs.length-1){C.i++;setTimeout(drawTestQ,150)}else drawTestQ()});
  $('wtPrev').onclick=()=>{if(C.i){C.i--;drawTestQ()}};
  $('wtNext').onclick=()=>{if(C.i<C.qs.length-1){C.i++;drawTestQ()}else{const un=C.a.filter(x=>x<0).length,fl=C.f.filter(Boolean).length;toast(un?un+' unanswered — tap the white numbers':fl?fl+' flagged — tap the orange numbers to check':'All answered! Submit when ready')}};
  $('wtFlag').onclick=()=>{C.f[i]=C.f[i]?0:1;save();drawTestQ()};
  document.querySelectorAll('.wtpal button').forEach(b=>b.onclick=()=>{C.i=+b.dataset.j;drawTestQ()});
  $('wtPause').onclick=()=>{save();toast('Saved — the clock stops until you come back');tab('home')};
  $('wtSubmit').onclick=()=>{const un=C.a.filter(x=>x<0).length;if(un&&!confirm(un+' question'+(un>1?'s are':' is')+' not answered yet. Submit anyway?'))return;submitTest(false)};
}
function submitTest(auto){
  if(WTI){clearInterval(WTI);WTI=null}const C=prog.wtCur;if(!C)return;const S=WT_SPEC();
  const sec=S.secs.map(s=>({k:s.k,n:s.n,r:0,t:s.q,s:0,m:s.q*s.m}));let score=0;const rev=[];
  C.qs.forEach((q,j)=>{const si=S.secs.findIndex(s=>s.k===q.sec),sm=S.secs[si].m,ok=C.a[j]===q.ans;if(ok){sec[si].r++;sec[si].s+=sm;score+=sm}
    if(q.id!==undefined){prog.seen[q.id]=1;if(q.cat){const st=prog.qstats[q.cat]||(prog.qstats[q.cat]={r:0,t:0});st.t++;if(ok)st.r++}
      prog.wrong=(prog.wrong||[]).filter(x=>x!==q.id);if(!ok){prog.wrong.push(q.id);if(prog.wrong.length>20)prog.wrong.shift()}else prog.qok[q.id]=1}
    addScore(q.cat?(TOPIC2S[q.cat]||'General Knowledge'):'Maths & Logic',ok?1:0,1);
    if(!ok)rev.push({n:j+1,sec:S.secs[si].n,q:q.text,mine:C.a[j]>=0?q.opts[C.a[j]]:'(not answered)',right:q.opts[q.ans],why:q.explain||'',steps:q.steps||null})});
  const max=S.secs.reduce((a,s)=>a+s.q*s.m,0),pct=Math.round(score/max*100),mins=Math.max(1,Math.round(C.el/60));
  prog.wt=prog.wt||{};prog.wt[C.wk]={d:today(),s:score,m:max,p:pct,mins,sec:sec.map(x=>({k:x.k,n:x.n,r:x.r,t:x.t,s:x.s,m:x.m})),
    wq:rev.filter(r=>r.why).slice(0,8).map(r=>({q:r.q,a:r.right}))};
  prog.wtRev={wk:C.wk,score,max,pct,mins,sec,rev};prog.wtCur=null;
  bump('wtest');roundDone('wtest');save();
  addXP(score+30,'Weekly test');SND.win();if(pct>=80)confetti();
  modal(pct>=80?'🏆':pct>=60?'🌟':'💪',score+' / '+max+' ('+pct+'%)',(auto?'Time is up! ':'')+(pct>=80?'Olympiad-ready work!':pct>=60?'Strong effort — check the explanations to grow even more.':'Good practice! The explanations will help a lot.'));
  renderTestResult(prog.wtRev);
}
function renderTestResult(R){
  if(!R){renderTestHome();return}show('testView');
  let h='<div class="card"><h2>📋 Test result</h2><div class="score" style="margin:8px 0"><div>Score<span>'+R.score+'/'+R.max+'</span></div><div>Percent<span>'+R.pct+'%</span></div><div>Time<span>'+R.mins+'m</span></div></div>'+
    '<h3>By section</h3>'+R.sec.map(s=>{const p=Math.round(s.r/s.t*100);return '<div class="mission"><span class="ic">'+(p>=80?'🟢':p>=50?'🟡':'🔴')+'</span><div class="tx">'+s.n+'<span style="float:right">'+s.r+'/'+s.t+' right · '+s.s+'/'+s.m+' marks</span><div class="mb"><i style="width:'+p+'%;background:'+(p>=80?'#2fbf71':p>=50?'#ffb020':'#ff5d5d')+'"></i></div></div></div>'}).join('');
  if(R.rev.length)h+='<h3>🔎 Learn from these ('+R.rev.length+')</h3>'+R.rev.map((r,j)=>'<div class="mission" data-rv="'+j+'" style="cursor:pointer"><span class="ic">Q'+r.n+'</span><div class="tx" style="font-weight:500">'+esc(r.q.length>90?r.q.slice(0,88)+'…':r.q)+'<br><small style="color:#137a46">✅ '+esc(r.right)+'</small> <small style="opacity:.6">· tap for why</small></div></div>').join('');
  else h+='<p class="tip">🏆 Every answer correct — amazing!</p>';
  h+='<button class="btn alt" id="wtBack" style="width:100%;margin-top:10px">⬅ Back</button></div>';
  $('testBody').innerHTML=h;
  document.querySelectorAll('[data-rv]').forEach(b=>b.onclick=()=>{const r=R.rev[+b.dataset.rv];showLearn({q:r.q,mine:r.mine,right:r.right,why:r.why,steps:r.steps})});
  $('wtBack').onclick=renderTestHome;
}
