
(()=>{
const root=document.getElementById('pouch-preview'),content=root.querySelector('main');
const header=root.querySelector('.app-header'),menu=root.querySelector('#app-navigation'),menuToggle=root.querySelector('.menu-toggle');
function setMenuOpen(open){
  menu.hidden=!open;
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
}
menuToggle.addEventListener('click',()=>setMenuOpen(menu.hidden));
document.addEventListener('pointerdown',event=>{if(!header.contains(event.target))setMenuOpen(false)});
header.addEventListener('focusout',event=>{if(!header.contains(event.relatedTarget))setMenuOpen(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){setMenuOpen(false);menuToggle.focus()}});
let view='today',product={brand:'Zyn',mg:6},notice='',entries=[],purchases=[];
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
let lastAdded=null,pouchFormOpen=false,feedbackTimer=null;
const activityOptions=['Working at kiosk','Concentrating on computer','At comedy','At a movie','At home','After eating','Traveling','Taking a break','Socializing','After waking up','Other'];
const addEntryIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>';
const closeEntryIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const pickerChevron='<svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
function entryPicker(name,label,options,value){
  const selected=options.find(option=>option.value===String(value));
  return `<label id="${name}-label" for="${name}-trigger">${label}</label>
    <div class="entry-picker" data-picker="${name}">
      <select id="entry-${name}" name="${name}" hidden aria-hidden="true" tabindex="-1">${options.map(option=>`<option value="${esc(option.value)}" ${option.value===String(value)?'selected':''}>${esc(option.label)}</option>`).join('')}</select>
      <button type="button" class="picker-trigger" id="${name}-trigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="${name}-options" aria-labelledby="${name}-label ${name}-value"><span class="picker-value" id="${name}-value">${esc(selected.label)}</span>${pickerChevron}</button>
      <div class="picker-options" id="${name}-options" role="listbox" aria-labelledby="${name}-label" hidden>${options.map(option=>`<button type="button" role="option" tabindex="-1" aria-selected="${option.value===String(value)}" data-picker-value="${esc(option.value)}">${esc(option.label)}</button>`).join('')}</div>
    </div>`;
}
function pouchEntryMarkup(){
  const fields=pouchFormOpen?`<form data-kind="pouch" class="pouch-form">
    <div class="pouch-product-fields"><div>${entryPicker('brand','Brand',['On!','Velo','Zyn'].map(value=>({value,label:value})),product.brand)}</div>
    <div>${entryPicker('mg','Nicotine per pouch',[3,6,9,11,12,15].map(mg=>({value:String(mg),label:`${mg} mg`})),product.mg)}</div></div>
    ${entryPicker('activity','What are you doing? (optional)',['',...activityOptions].map(value=>({value,label:value||'Not specified'})),'')}
    <div class="pouch-form-actions"><button type="submit" class="primary">Add pouch</button><button type="button" data-action="cancel-pouch">Cancel</button></div>
  </form>`:'';
  return `<section class="pouch-entry" aria-labelledby="pouch-entry-title"><div class="row pouch-entry-heading"><h2 id="pouch-entry-title">Add pouch</h2>
    ${notice?`<div class="pouch-feedback" role="status" aria-live="polite">${notice}<button type="button" class="link" data-action="undo">Undo</button></div>`:`<button type="button" class="add-entry-icon" data-action="open-pouch" aria-label="${pouchFormOpen?'Close pouch entry':'Add pouch entry'}" aria-expanded="${pouchFormOpen}" aria-controls="pouch-entry-form">${pouchFormOpen?closeEntryIcon:addEntryIcon}</button>`}
  </div><div id="pouch-entry-form" ${pouchFormOpen?'':'hidden'}>${fields}</div></section>`;
}
// All entry fields share the same bounded popup and dismissal behavior.
function closeEntryPicker(picker,restoreFocus=false){
  picker.querySelector('.picker-options').hidden=true;
  const trigger=picker.querySelector('.picker-trigger');trigger.setAttribute('aria-expanded','false');
  if(restoreFocus)trigger.focus({preventScroll:true});
}
function openEntryPicker(picker,edge){
  content.querySelectorAll('.entry-picker').forEach(other=>{if(other!==picker)closeEntryPicker(other)});
  const list=picker.querySelector('.picker-options'),trigger=picker.querySelector('.picker-trigger');
  const rect=trigger.getBoundingClientRect(),viewport=window.visualViewport;
  const viewportTop=viewport?.offsetTop||0,viewportBottom=viewportTop+(viewport?.height||window.innerHeight);
  const below=viewportBottom-rect.bottom-12,above=rect.top-viewportTop-12;
  const opensAbove=below<180&&above>below;
  list.classList.toggle('opens-above',opensAbove);
  list.style.maxHeight=`${Math.max(44,Math.min(220,opensAbove?above:below))}px`;
  list.hidden=false;trigger.setAttribute('aria-expanded','true');
  const options=[...list.querySelectorAll('[role="option"]')];
  const option=edge==='first'?options[0]:edge==='last'?options.at(-1):list.querySelector('[aria-selected="true"]');
  option.focus({preventScroll:true});option.scrollIntoView?.({block:'nearest'});
}
let pressedPickerTrigger=null,pressedPickerWasOpen=false;
document.addEventListener('pointerdown',event=>{
  pressedPickerTrigger=event.target.closest('.picker-trigger');
  pressedPickerWasOpen=pressedPickerTrigger?.getAttribute('aria-expanded')==='true';
  const targetPicker=event.target.closest('.entry-picker');
  content.querySelectorAll('.entry-picker').forEach(picker=>{if(picker!==targetPicker)closeEntryPicker(picker)});
});
root.addEventListener('click',event=>{
  const trigger=event.target.closest('.picker-trigger');
  if(trigger){
    const picker=trigger.closest('.entry-picker');
    // Preserve the state at touch-down even if mobile focus changes before click.
    const wasOpen=trigger===pressedPickerTrigger?pressedPickerWasOpen:trigger.getAttribute('aria-expanded')==='true';
    pressedPickerTrigger=null;
    if(wasOpen)closeEntryPicker(picker,true);else openEntryPicker(picker);
  }
  const option=event.target.closest('[data-picker-value]');
  if(option){
    const picker=option.closest('.entry-picker'),select=picker.querySelector('select');select.value=option.dataset.pickerValue;
    picker.querySelector('.picker-value').textContent=option.textContent;
    picker.querySelectorAll('[role="option"]').forEach(item=>item.setAttribute('aria-selected',String(item===option)));
    select.dispatchEvent(new Event('change',{bubbles:true}));closeEntryPicker(picker,true);
  }
});
root.addEventListener('focusout',event=>{
  const picker=event.target.closest('.entry-picker');
  // iOS may report a null target during a tap. Outside taps are handled above.
  if(picker&&event.relatedTarget&&!picker.contains(event.relatedTarget))closeEntryPicker(picker);
});
let pickerSearch='',pickerSearchTime=0;
root.addEventListener('keydown',event=>{
  const picker=event.target.closest('.entry-picker');if(!picker)return;
  pressedPickerTrigger=null;
  const list=picker.querySelector('.picker-options'),options=[...list.querySelectorAll('[role="option"]')];
  if(event.key==='Escape'&&!list.hidden){event.preventDefault();closeEntryPicker(picker,true);return;}
  if(event.key==='Tab'){closeEntryPicker(picker,true);return;}
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
    event.preventDefault();
    if(list.hidden){openEntryPicker(picker,event.key==='Home'?'first':event.key==='End'?'last':undefined);return;}
    const index=options.indexOf(document.activeElement);
    const next=event.key==='Home'?0:event.key==='End'?options.length-1:Math.max(0,Math.min(options.length-1,index+(event.key==='ArrowDown'?1:-1)));
    options[next].focus({preventScroll:true});options[next].scrollIntoView?.({block:'nearest'});
  }else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&event.key!==' '){
    event.preventDefault();if(list.hidden)openEntryPicker(picker);
    const now=Date.now();pickerSearch=now-pickerSearchTime>700?event.key:pickerSearch+event.key;pickerSearchTime=now;
    const match=options.find(option=>option.textContent.toLowerCase().startsWith(pickerSearch.toLowerCase()));
    if(match){match.focus({preventScroll:true});match.scrollIntoView?.({block:'nearest'});}
  }
});
function closePouchEntry(){
  pouchFormOpen=false;clearTimeout(feedbackTimer);notice='';render();
  content.querySelector('[data-action="open-pouch"]')?.focus({preventScroll:true});
}
function schedulePouchFeedbackDismissal(){
  clearTimeout(feedbackTimer);
  feedbackTimer=setTimeout(()=>{
    const feedback=content.querySelector('.pouch-feedback');
    if(feedback?.contains(document.activeElement)){schedulePouchFeedbackDismissal();return;}
    notice='';
    const section=content.querySelector('.pouch-entry');if(section)section.outerHTML=pouchEntryMarkup();
  },4000);
}
function addPouchFromForm(form){
  if(!pouchFormOpen)return;
  const data=new FormData(form),brand=data.get('brand'),mg=Number(data.get('mg')),activity=data.get('activity');
  if(!['On!','Velo','Zyn'].includes(brand)||![3,6,9,11,12,15].includes(mg)||(activity&&!activityOptions.includes(activity)))return;
  let id=Date.now();while(findEntry(id))id++;
  const entry={id,type:'pouch',brand,mg,date:localDate(new Date()),time:time()};
  if(activity)entry.activity=activity;
  entries.unshift(entry);
  if(!persist()){entries=entries.filter(item=>item.id!==id);return;}
  lastAdded=id;pouchFormOpen=false;notice='Pouch added';render();
  content.focus({preventScroll:true});schedulePouchFeedbackDismissal();
}

try{const saved=JSON.parse(localStorage.getItem('pouch-tracker-v1'));if(saved){product=saved.product;entries=saved.entries;purchases=saved.purchases}}catch{}
const persist=()=>{try{localStorage.setItem('pouch-tracker-v1',JSON.stringify({version:1,product,entries,purchases}));return true}catch{alert('Could not save. Please export your data before closing the app.');return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+n.toFixed(2),time=()=>new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
const items=()=>[...entries,...purchases].sort((a,b)=>b.id-a.id);
const entryChevron='<svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const findEntry=id=>[...entries,...purchases].find(entry=>entry.id===id);
const validOptionalActivity=entry=>entry.activity===undefined||(typeof entry.activity==='string'&&entry.activity.length<=120);
const validOptionalNote=entry=>entry.note===undefined||(typeof entry.note==='string'&&entry.note.length<=1000);
function rows(list){
  return list.map(entry=>{
    const title=entry.type==='pouch'?`${esc(entry.brand)} · ${entry.mg} mg`:entry.type==='craving'?`Craving · ${entry.intensity}/5`:`${esc(entry.brand)} · ${entry.tins} tin${entry.tins>1?'s':''}`;
    return `<details class="entry history-entry" data-entry-id="${entry.id}" name="entry-options">
      <summary><span class="entry-description">${title}<small>${esc(entry.time)}${entry.activity?' · '+esc(entry.activity):''}${entry.replacement?' · '+esc(entry.replacement):''}${entry.note?' · Note added':''}</small></span><span class="entry-cost">${entry.type==='purchase'?money(entry.amount):''}</span>${entryChevron}</summary>
      <div class="entry-details">
        ${entry.note?`<p class="entry-note">${esc(entry.note)}</p>`:''}
        <div class="entry-actions"><button type="button" class="link" data-note="${entry.id}">${entry.note?'Edit note':'Add note'}</button><button type="button" class="link" data-delete="${entry.id}" aria-label="Delete entry">Delete</button></div>
        <form class="note-form" data-kind="note" data-id="${entry.id}" hidden>
          <label for="note-${entry.id}">Note</label><textarea id="note-${entry.id}" name="note" rows="2" maxlength="1000">${esc(entry.note||'')}</textarea>
          <div class="note-buttons"><button type="submit" class="primary">Save note</button><button type="button" data-note-cancel="${entry.id}">Cancel</button></div>
        </form>
        <p class="note-status" role="status" aria-live="polite"></p>
      </div>
    </details>`;
  }).join('')||'<div class="empty">No entries yet.</div>';
}
function editEntryNote(button,editing){
  const row=button.closest('.history-entry');
  const editor=row.querySelector('.note-form');
  editor.hidden=!editing;
  row.querySelector('.entry-actions').hidden=editing;
  const preview=row.querySelector('.entry-note');
  if(preview)preview.hidden=editing;
  if(editing){editor.elements.note.focus();return;}
  editor.elements.note.value=findEntry(Number(row.dataset.entryId))?.note||'';
  row.querySelector('[data-note]').focus();
}
function saveEntryNote(form){
  const id=Number(form.dataset.id),entry=findEntry(id);
  if(!entry)return;
  const note=form.elements.note.value.trim();
  if(note.length>1000){form.elements.note.setCustomValidity('Keep your note to 1,000 characters or fewer.');form.elements.note.reportValidity();return;}
  form.elements.note.setCustomValidity('');
  const previous=entry.note;
  if(note)entry.note=note;else delete entry.note;
  if(!persist()){if(previous===undefined)delete entry.note;else entry.note=previous;return;}
  render();
  const row=content.querySelector(`[data-entry-id="${id}"]`);
  if(row){
    const recent=row.closest('.recent');if(recent)recent.open=true;
    row.open=true;
    row.querySelector('.note-status').textContent=note?'Note saved.':'Note cleared.';
    row.querySelector('[data-note]').focus({preventScroll:true});
  }
}
function scrollToResourceSection(link){
  const id=link.getAttribute('href').slice(1),section=document.getElementById(id);
  if(!section||!content.contains(section))return;
  const heading=section.querySelector('h2');
  if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});
}

function render(){
root.querySelectorAll('nav button').forEach(b=>b.dataset.view===view?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
const today=localDate(new Date()),week=new Date();week.setHours(0,0,0,0);week.setDate(week.getDate()-((week.getDay()+6)%7));const weekKey=localDate(week),month=today.slice(0,7);let total=entries.filter(e=>e.type==='pouch'&&e.date===today),spent=purchases.filter(p=>p.date>=weekKey&&p.date<=today).reduce((s,p)=>s+p.amount,0),monthSpent=purchases.filter(p=>p.date.startsWith(month)&&p.date<=today).reduce((s,p)=>s+p.amount,0);
if(view==='today')content.innerHTML=`${pouchEntryMarkup()}<h3>Summary</h3><div class="totals"><div><div class="value">${total.length}</div><div class="caption">Pouches</div></div><div><div class="value">${total.reduce((s,e)=>s+e.mg,0)} <small>mg</small></div><div class="caption">Nicotine</div></div></div><h3>Spending</h3><div class="row"><span class="caption">This week</span><span>${money(spent)}</span></div><div class="row"><span class="caption">This month</span><span>${money(monthSpent)}</span></div><div class="actions" style="margin-top:10px"><button class="link" data-action="purchase">Log purchase</button></div><details class="recent"><summary>Recent entries <svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>${rows(entries.filter(e=>e.date===today).slice(0,3))}</details>`;
if(view==='history')content.innerHTML=`<h2>History</h2>${rows(items())}`;
if(view==='trends'){const dates=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d});const vals=dates.map(d=>{const found=entries.filter(e=>e.date===localDate(d));return found.length?found.length:null}),days=dates.map((d,i)=>i===6?'Today':d.toLocaleDateString([], {weekday:'short'}));content.innerHTML=`<h2>Trends</h2><div class="caption">Pouches logged · last 7 days</div><div class="bars" role="img" aria-label="Daily pouch counts: ${vals.map((v,i)=>days[i]+': '+(v===null?'unlogged':v)).join(', ')}">${vals.map((n,i)=>`<div class="column"><span>${n===null?'—':n}</span><div class="bar" style="height:${n===null?0:Math.min(n*8,100)}px"></div><small>${days[i]}</small></div>`).join('')}</div><div class="entry"><span>Seven-day average</span><span>${vals.filter(v=>v!==null).length===7?(vals.reduce((a,b)=>a+b,0)/7).toFixed(1)+' pouches':'Not enough data'}</span></div><div class="entry"><span>Purchases this month</span><span>${money(monthSpent)}</span></div><div class="caption">— Unlogged day</div>`}
if(view==='resources')content.innerHTML=window.pouchResources;
if(view==='settings')content.innerHTML=`<h2>Settings</h2><h3>Default product</h3><div class="row"><span>${esc(product.brand)} · ${product.mg} mg</span><button class="link" data-action="product">Change</button></div><h3>Your data</h3><div class="caption">Logs are saved on this device. Export a backup before clearing browser data or switching phones.</div><div class="form-actions"><button data-action="export">Export backup</button><button data-action="restore">Restore backup</button></div><input type="file" id="backup-file" accept="application/json,.json" hidden><h3>App updates</h3><div class="caption">Check for the latest app files and reload. Your saved logs and settings stay on this device.</div><button data-action="update">Update app</button><p id="update-status" role="status" aria-live="polite"></p><h3>About totals</h3><div class="caption">Labeled nicotine is the content listed on the pouch, not the amount absorbed. Weeks start Monday. Unlogged days are unknown.</div>`;
}
function form(kind){notice='';let fields='';
if(kind==='product')fields=`<label for="pp-brand">Brand</label><select id="pp-brand" name="brand">${['On!','Velo','Zyn'].map(b=>`<option ${b===product.brand?'selected':''}>${b}</option>`).join('')}</select><label for="pp-mg">Labeled mg per pouch</label><select id="pp-mg" name="mg">${[3,6,9,11,12,15].map(n=>`<option value="${n}" ${n===product.mg?'selected':''}>${n} mg</option>`).join('')}</select>`;
if(kind==='craving')fields=`<label for="pp-intensity">Intensity · 1 mild, 5 strongest</label><select id="pp-intensity" name="intensity">${[1,2,3,4,5].map(n=>`<option ${n===3?'selected':''}>${n}</option>`).join('')}</select><label for="pp-replacement">Replacement or delay · optional</label><input id="pp-replacement" name="replacement" placeholder="e.g. gum, walk, wait 10 minutes" maxlength="120">`;
if(kind==='purchase')fields=`<label for="pp-pbrand">Brand</label><select id="pp-pbrand" name="brand"><option>On!</option><option>Velo</option><option selected>Zyn</option></select><label for="pp-tins">Number of tins</label><input id="pp-tins" name="tins" type="number" min="1" step="1" required value="1"><label for="pp-amount">Total paid ($)</label><input id="pp-amount" name="amount" type="number" min="0" step="0.01" required placeholder="8.00"><label for="pp-date">Purchase date</label><input id="pp-date" name="date" type="date" required value="${localDate(new Date())}">`;
content.innerHTML=`<h2>${kind==='product'?'Change product':kind==='craving'?'Log craving':'Log purchase'}</h2><form data-kind="${kind}">${fields}<div class="form-actions"><button class="primary" type="submit">Save</button><button type="button" data-action="cancel">Cancel</button></div></form>`;
}
async function updateApp(button){
const status=root.querySelector('#update-status');
button.disabled=true;status.textContent='Checking for updates…';
try{
  if(!navigator.onLine)throw Error('You are offline. Connect to the internet and try again.');
  if('serviceWorker' in navigator){
    const registration=await navigator.serviceWorker.getRegistration();
    if(registration){
      await registration.update();
      const worker=registration.installing;
      if(worker)await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(Error('Update timed out. Try again.')),15000);
        const check=()=>{if(worker.state==='installed'||worker.state==='activated'){clearTimeout(timer);resolve()}else if(worker.state==='redundant'){clearTimeout(timer);reject(Error('The update could not be installed. Try again.'))}};
        worker.addEventListener('statechange',check);check();
      });
      const waiting=registration.waiting;
      if(waiting)await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(Error('Update timed out. Close and reopen the app, then try again.')),15000);
        const check=()=>{if(waiting.state==='activated'){clearTimeout(timer);resolve()}else if(waiting.state==='redundant'){clearTimeout(timer);reject(Error('The update could not activate. Try again.'))}};
        waiting.addEventListener('statechange',check);waiting.postMessage({type:'SKIP_WAITING'});check();
      });
    }
  }
  // Refresh the document and its current asset URLs in the HTTP cache.
  const response=await fetch('./index.html',{cache:'reload'});
  if(!response.ok)throw Error('Could not download the update. Try again.');
  const doc=new DOMParser().parseFromString(await response.text(),'text/html');
  const assets=[...doc.querySelectorAll('script[src],link[rel="stylesheet"]')].map(el=>new URL(el.getAttribute('src')||el.getAttribute('href'),location.href));
  await Promise.all(assets.map(async url=>{if(url.origin!==location.origin)return;const res=await fetch(url,{cache:'reload'});if(!res.ok)throw Error('Could not download all app files. Try again.')}));
  status.textContent='App files refreshed. Reloading…';
  location.reload();
}catch(error){status.textContent=error.message||'Could not update. Check your connection and try again.';button.disabled=false;}
}
root.addEventListener('click',e=>{const articleLink=e.target.closest('.resource-contents a[href^="#"]');if(articleLink){e.preventDefault();scrollToResourceSection(articleLink);return;}const b=e.target.closest('button, .brand');if(!b)return;if(b.dataset.note){editEntryNote(b,true);return;}if(b.dataset.noteCancel){editEntryNote(b,false);return;}if(b.dataset.view){e.preventDefault();setMenuOpen(false);view=b.dataset.view;notice='';pouchFormOpen=false;clearTimeout(feedbackTimer);render();content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return}if(b.dataset.delete){const id=Number(b.dataset.delete);entries=entries.filter(x=>x.id!==id);purchases=purchases.filter(x=>x.id!==id);persist();notice='';render();return}const a=b.dataset.action;if(a==='update'){updateApp(b);return}if(a==='open-pouch'){if(pouchFormOpen){closePouchEntry();return;}pouchFormOpen=true;notice='';clearTimeout(feedbackTimer);render();content.querySelector('[data-action="open-pouch"]').focus({preventScroll:true});}else if(a==='cancel-pouch'){closePouchEntry();}else if(a==='undo'){const previous=entries;entries=entries.filter(e=>e.id!==lastAdded);if(!persist()){entries=previous;return;}closePouchEntry();}else if(a==='export'){const blob=new Blob([JSON.stringify({version:1,product,entries,purchases},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='pouch-tracker-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}else if(a==='restore'){root.querySelector('#backup-file').click()}else if(a==='cancel')render();else if(a)form(a)});
root.addEventListener('input',e=>{if(e.target.matches('.note-form textarea'))e.target.setCustomValidity('')});
root.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=new FormData(f),kind=f.dataset.kind;if(kind==='pouch'){addPouchFromForm(f);return;}if(kind==='note'){saveEntryNote(f);return;}if(kind==='product')product={brand:d.get('brand'),mg:Number(d.get('mg'))};else if(kind==='craving')entries.unshift({id:Date.now(),type:kind,intensity:Number(d.get('intensity')),replacement:d.get('replacement'),time:time()});else purchases.unshift({id:Date.now(),type:kind,brand:d.get('brand'),tins:Number(d.get('tins')),amount:Number(d.get('amount')),date:d.get('date'),time:d.get('date')});persist();render()});
root.addEventListener('change',async e=>{if(e.target.id!=='backup-file'||!e.target.files[0])return;try{const d=JSON.parse(await e.target.files[0].text());const strengths=[3,6,9,11,12,15],brands=['On!','Velo','Zyn'];if(d.version!==1||!brands.includes(d.product?.brand)||!strengths.includes(d.product?.mg)||!Array.isArray(d.entries)||!Array.isArray(d.purchases))throw Error();if(!d.entries.every(x=>validOptionalNote(x)&&validOptionalActivity(x)&&x.type==='pouch'&&brands.includes(x.brand)&&strengths.includes(x.mg)&&Number.isFinite(x.id)&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&typeof x.time==='string')||!d.purchases.every(x=>validOptionalNote(x)&&validOptionalActivity(x)&&x.type==='purchase'&&brands.includes(x.brand)&&Number.isFinite(x.id)&&Number.isInteger(x.tins)&&x.tins>0&&Number.isFinite(x.amount)&&x.amount>=0&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&typeof x.time==='string'))throw Error();if(!confirm('Replace device logs with this backup?'))return;product=d.product;entries=d.entries;purchases=d.purchases;persist();render();alert('Backup restored.')}catch{alert('This is not a valid Pouch Tracker backup.')}});
render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');
})();
