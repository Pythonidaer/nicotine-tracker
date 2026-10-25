
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
let trendOffset=0,spendingTrends=false,activityTrends=false;
let view='today',product={brand:'Zyn',mg:6},notice='',entries=[],purchases=[];
let customOptions={brands:[],strengths:[]};
let tapering=PouchTaper.read(),pouchDraft=null,pendingPouch=null,skipCravingPrompt=false;
let sudokuGame=null,cravingStartedAt=0,cravingFinishedAt=0,cravingTimer=null,sudokuMessage='',sudokuConflicts=[];
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
let lastAdded=null,pouchFormOpen=false,feedbackTimer=null;
const activityOptions=['Working at kiosk','Concentrating on computer','At comedy','At a movie','At home','After eating','Traveling','Taking a break','Socializing','After waking up','Other'];
const addEntryIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>';
const closeEntryIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const pickerChevron='<svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
function entryPicker(name,label,options,value,suffix=""){
  const pickerId=name+suffix;
  const selected=options.find(option=>option.value===String(value));
  return `<label id="${pickerId}-label" for="${pickerId}-trigger">${label}</label>
    <div class="entry-picker" data-picker="${name}">
      <select id="entry-${pickerId}" name="${name}" hidden aria-hidden="true" tabindex="-1">${options.map(option=>`<option value="${esc(option.value)}" ${option.value===String(value)?'selected':''}>${esc(option.label)}</option>`).join('')}</select>
      <button type="button" class="picker-trigger" id="${pickerId}-trigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="${pickerId}-options" aria-labelledby="${pickerId}-label ${pickerId}-value"><span class="picker-value" id="${pickerId}-value">${esc(selected.label)}</span>${pickerChevron}</button>
      <div class="picker-options" id="${pickerId}-options" role="listbox" aria-labelledby="${pickerId}-label" hidden>${options.map(option=>`<button type="button" role="option" tabindex="-1" aria-selected="${option.value===String(value)}" data-picker-value="${esc(option.value)}">${esc(option.label)}</button>`).join('')}</div>
    </div>`;
}
function pouchEntryMarkup(){
  const draft=pouchDraft||product;
  const fields=pouchFormOpen?`<form data-kind="pouch" class="pouch-form">
    <div class="pouch-product-fields"><div>${entryPicker('brand','Brand',brandValues().map(value=>({value,label:value})),draft.brand)}</div>
    <div>${entryPicker('mg','Nicotine per pouch',strengthValues().map(mg=>({value:String(mg),label:`${mg} mg`})),draft.mg)}</div></div>
    ${entryPicker('activity','What are you doing? (optional)',['',...activityOptions].map(value=>({value,label:value||'Not specified'})),pouchDraft?.activity||'')}
    <div class="form-actions"><button type="submit" class="primary">Save</button><button type="button" data-action="cancel-pouch">Cancel</button></div>
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
  pouchFormOpen=false;pouchDraft=null;pendingPouch=null;skipCravingPrompt=false;clearTimeout(feedbackTimer);notice='';render();
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
  if(!brandValues().includes(brand)||!strengthValues().includes(mg)||(activity&&!activityOptions.includes(activity)))return;
  const draft={brand,mg,activity:activity||''},today=entries.filter(e=>e.type==='pouch'&&e.date===localDate(new Date()));
  const plan=PouchTaper.plan(entries,tapering);
  if(!skipCravingPrompt&&PouchTaper.exceeds(plan,today.length,today.reduce((sum,e)=>sum+e.mg,0),mg)){
    pendingPouch=draft;pouchDraft=draft;
    const dialog=root.querySelector('#craving-prompt');
    dialog.querySelector('#craving-prompt-detail').textContent='This entry would put you above your daily guide of '+plan.countTarget+' pouches or '+formatAmount(plan.nicotineTarget)+' mg.';
    dialog.showModal();return;
  }
  commitPouch(draft);
}
function commitPouch(draft){
  let id=Date.now();while(findEntry(id))id++;
  const entry={id,type:'pouch',brand:draft.brand,mg:draft.mg,date:localDate(new Date()),time:time()};
  if(draft.activity)entry.activity=draft.activity;
  entries.unshift(entry);
  if(!persist()){entries=entries.filter(item=>item.id!==id);return false;}
  lastAdded=id;pouchFormOpen=false;pouchDraft=null;pendingPouch=null;skipCravingPrompt=false;notice='Pouch added';render();
  content.focus({preventScroll:true});schedulePouchFeedbackDismissal();return true;
}

try{const saved=JSON.parse(localStorage.getItem('pouch-tracker-v1'));if(saved){product=saved.product;entries=saved.entries;purchases=saved.purchases;customOptions=readCustomOptions(saved.options);tapering=PouchTaper.read(saved.tapering)}}catch{}
const persist=()=>{try{localStorage.setItem('pouch-tracker-v1',JSON.stringify({version:1,product,entries,purchases,options:customOptions,tapering}));return true}catch{alert('Could not save. Please export your data before closing the app.');return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+n.toFixed(2),time=()=>new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
const items=()=>[...entries,...purchases].sort((a,b)=>b.id-a.id);
const entryChevron='<svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const findEntry=id=>[...entries,...purchases].find(entry=>entry.id===id);
const validOptionalActivity=entry=>entry.activity===undefined||(typeof entry.activity==='string'&&entry.activity.length<=120);
const validOptionalNote=entry=>entry.note===undefined||(typeof entry.note==='string'&&entry.note.length<=1000);

function validBrand(value){
  return typeof value==='string'&&value===value.trim()&&value.length>0&&value.length<=60&&!/[\u0000-\u001f\u007f]/.test(value);
}
function validStrength(value){return typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1000;}
function readCustomOptions(options){
  if(options===undefined)return {brands:[],strengths:[]};
  if(!options||!Array.isArray(options.brands)||!Array.isArray(options.strengths)||!options.brands.every(validBrand)||!options.strengths.every(validStrength))throw Error('Invalid product options');
  return {brands:uniqueBrands(options.brands),strengths:[...new Set(options.strengths)].sort((a,b)=>a-b)};
}
function uniqueBrands(values){
  const found=new Set();return values.filter(value=>{const key=value.toLocaleLowerCase();if(found.has(key))return false;found.add(key);return true;});
}
function brandValues(){
  // Retain exact historical spellings so old record selections always resolve.
  return [...new Set(['On!','Velo','Zyn',...customOptions.brands,product.brand,...entries.map(e=>e.brand),...purchases.map(e=>e.brand)].filter(validBrand))];
}
function strengthValues(){
  return [...new Set([3,6,9,11,12,15,...customOptions.strengths,product.mg,...entries.filter(e=>e.type==='pouch').map(e=>e.mg)].filter(validStrength))].sort((a,b)=>a-b);
}
function validBackup(data){
  if(!data||data.version!==1||!validBrand(data.product?.brand)||!validStrength(data.product?.mg)||!Array.isArray(data.entries)||!Array.isArray(data.purchases))return false;
  try{readCustomOptions(data.options);PouchTaper.read(data.tapering)}catch{return false}
  const common=entry=>entry&&validBrand(entry.brand)&&validOptionalNote(entry)&&validOptionalActivity(entry)&&Number.isFinite(entry.id)&&/^\d{4}-\d{2}-\d{2}$/.test(entry.date)&&typeof entry.time==='string';
  return data.entries.every(entry=>common(entry)&&entry.type==='pouch'&&validStrength(entry.mg))&&data.purchases.every(entry=>common(entry)&&entry.type==='purchase'&&Number.isInteger(entry.tins)&&entry.tins>0&&Number.isFinite(entry.amount)&&entry.amount>=0);
}
function saveCustomOption(form,kind,data){
  const input=form.elements.value;
  const value=kind==='brand-option'?String(data.get('value')||'').trim().replace(/\s+/g,' '):Number(data.get('value'));
  const valid=kind==='brand-option'?validBrand(value):String(data.get('value')||'').trim()!==''&&validStrength(value);
  const duplicate=kind==='brand-option'?brandValues().some(brand=>brand.toLocaleLowerCase()===String(value).toLocaleLowerCase()):strengthValues().includes(value);
  input.setCustomValidity(!valid?'Enter a valid '+(kind==='brand-option'?'brand name (up to 60 characters).':'nicotine strength between 0 and 1000 mg.'):duplicate?'This option already exists.':'');
  if(!valid||duplicate){input.reportValidity();return;}
  const previous=customOptions;
  customOptions={brands:[...previous.brands],strengths:[...previous.strengths]};
  customOptions[kind==='brand-option'?'brands':'strengths'].push(value);
  if(!persist()){customOptions=previous;return;}
  render();const status=content.querySelector('#product-options-status');if(status)status.textContent=kind==='brand-option'?'Brand added.':'Nicotine strength added.';
}

function historyDate(date){
  return new Date(`${date}T12:00:00`).toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'});
}
function weeklyHistory(){
  const records=items().sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  if(!records.length)return rows([]);
  const weeks=new Map();
  for(const entry of records){
    // Use the saved local date, so timezone changes do not move old records.
    const monday=new Date(`${entry.date}T12:00:00`);
    monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const key=localDate(monday);
    if(!weeks.has(key))weeks.set(key,[]);
    weeks.get(key).push(entry);
  }
  return [...weeks].map(([key,weekEntries])=>{
    const start=new Date(`${key}T12:00:00`),end=new Date(start);end.setDate(end.getDate()+6);
    const sameYear=start.getFullYear()===end.getFullYear();
    const startLabel=start.toLocaleDateString([], {month:'short',day:'numeric',...(sameYear?{}:{year:'numeric'})});
    const endLabel=end.toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'});
    return `<section class="history-week" aria-labelledby="week-${key}"><h3 id="week-${key}">${esc(startLabel)} – ${esc(endLabel)}</h3>${rows(weekEntries,true)}</section>`;
  }).join('');
}
function rows(list,showDate=false,readOnly=false){
  return list.map(entry=>{
    const title=entry.type==='pouch'?`${esc(entry.brand)}, ${entry.mg} mg`:entry.type==='craving'?`Craving · ${entry.intensity}/5`:`${esc(entry.brand)}, ${entry.tins} tin${entry.tins>1?'s':''}`;
    if(readOnly)return `<div class="entry recent-entry" data-entry-id="${entry.id}"><div class="entry-description">${title}<small>${esc(entry.time)}${entry.activity?' · '+esc(entry.activity):''}${entry.replacement?' · '+esc(entry.replacement):''}</small></div></div>`;
    return `<details class="entry history-entry" data-entry-id="${entry.id}" name="entry-options">
      <summary><span class="entry-description">${title}<small>${showDate?esc(historyDate(entry.date))+' · ':''}${esc(entry.time)}${entry.activity?' · '+esc(entry.activity):''}${entry.replacement?' · '+esc(entry.replacement):''}</small></span><span class="entry-cost">${entry.type==='purchase'?money(entry.amount):''}</span>${entryChevron}</summary>
      <div class="entry-details">
        ${entry.note?`<p class="entry-note">${esc(entry.note)}</p>`:''}
        <div class="entry-actions"><button type="button" class="link" data-edit="${entry.id}">Edit entry</button><button type="button" class="link" data-delete="${entry.id}" aria-label="Delete entry">Delete</button></div>
        <div class="entry-editor" hidden></div>
        <p class="note-status" role="status" aria-live="polite"></p>
      </div>
    </details>`;
  }).join('')||'<div class="empty">No entries yet.</div>';
}
function editRecord(button,editing){
  const row=button.closest('.history-entry'),editor=row.querySelector('.entry-editor');
  editor.hidden=!editing;row.querySelector('.entry-actions').hidden=editing;
  const preview=row.querySelector('.entry-note');if(preview)preview.hidden=editing;
  if(!editing){editor.innerHTML='';row.querySelector('[data-edit]').focus({preventScroll:true});return;}
  const entry=findEntry(Number(row.dataset.entryId));if(!entry)return;
  const suffix=`-${entry.id}`,brands=brandValues().map(value=>({value,label:value}));
  let fields=entryPicker('brand','Brand',brands,entry.brand,suffix);
  if(entry.type==='pouch'){
    fields=`<div class="pouch-product-fields"><div>${fields}</div><div>${entryPicker('mg','Nicotine per pouch',strengthValues().map(mg=>({value:String(mg),label:`${mg} mg`})),entry.mg,suffix)}</div></div>`;
    const activities=['',...activityOptions];
    // Preserve an existing activity from a backup even if it is not in today's list.
    if(entry.activity&&!activities.includes(entry.activity))activities.push(entry.activity);
    fields+=entryPicker('activity','What are you doing? (optional)',activities.map(value=>({value,label:value||'Not specified'})),entry.activity||'',suffix);
  }else if(entry.type==='purchase'){
    fields+=`<div class="pouch-product-fields"><div><label for="tins${suffix}">Number of tins</label><input id="tins${suffix}" name="tins" type="number" min="1" step="1" required value="${entry.tins}"></div><div><label for="amount${suffix}">Total paid ($)</label><input id="amount${suffix}" name="amount" type="number" min="0" step="0.01" required value="${entry.amount}"></div></div><label for="date${suffix}">Purchase date</label><input id="date${suffix}" name="date" type="date" required value="${esc(entry.date)}">`;
  }
  editor.innerHTML=`<form class="record-form" data-kind="record" data-id="${entry.id}">${fields}<label for="note${suffix}">Note (optional)</label><textarea id="note${suffix}" name="note" rows="5" maxlength="1000">${esc(entry.note||'')}</textarea><div class="note-buttons"><button type="submit" class="primary">Save changes</button><button type="button" data-edit-cancel="${entry.id}">Cancel</button></div></form>`;
  const form=editor.querySelector('form');form.setAttribute('tabindex','-1');form.focus({preventScroll:true});
  const note=form.elements.note;note.style.height=`${Math.min(320,Math.max(144,note.scrollHeight))}px`;note.scrollTop=0;
}
function saveRecord(form){
  const id=Number(form.dataset.id),entry=findEntry(id);if(!entry)return;
  const data=new FormData(form),brand=data.get('brand'),note=data.get('note').trim();
  if(!brandValues().includes(brand))return;
  if(note.length>1000){form.elements.note.setCustomValidity('Keep your note to 1,000 characters or fewer.');form.elements.note.reportValidity();return;}
  form.elements.note.setCustomValidity('');
  const updated={...entry,brand};
  if(entry.type==='pouch'){
    const mg=Number(data.get('mg')),activity=data.get('activity');
    if(!strengthValues().includes(mg)||typeof activity!=='string'||activity.length>120||(!activityOptions.includes(activity)&&activity!==''&&activity!==entry.activity))return;
    updated.mg=mg;if(activity)updated.activity=activity;else delete updated.activity;
  }else if(entry.type==='purchase'){
    const tins=Number(data.get('tins')),amount=Number(data.get('amount')),date=data.get('date');
    if(!Number.isInteger(tins)||tins<1||!Number.isFinite(amount)||amount<0||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
    updated.tins=tins;updated.amount=amount;updated.date=date;if(date!==entry.date)updated.time=date;
  }
  if(note)updated.note=note;else delete updated.note;
  const collection=entry.type==='purchase'?purchases:entries,index=collection.indexOf(entry);
  collection[index]=updated;
  if(!persist()){collection[index]=entry;return;}
  render();
  const row=content.querySelector(`[data-entry-id="${id}"]`);
  if(row){const recent=row.closest('.recent');if(recent)recent.open=true;row.open=true;row.querySelector('.note-status').textContent='Entry updated.';row.querySelector('[data-edit]').focus({preventScroll:true});}
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
clearInterval(cravingTimer);cravingTimer=null;
content.classList.toggle('trends-layout',view==='trends');
root.querySelectorAll('nav button').forEach(b=>b.dataset.view===view?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
if(view==='craving'){content.innerHTML=cravingMarkup();updateCravingTimer();cravingTimer=setInterval(updateCravingTimer,1000);return;}
if(view==='today'&&pouchFormOpen){content.innerHTML=pouchEntryMarkup();return;}
const today=localDate(new Date()),week=new Date();week.setHours(0,0,0,0);week.setDate(week.getDate()-((week.getDay()+6)%7));const weekKey=localDate(week),month=today.slice(0,7);let total=entries.filter(e=>e.type==='pouch'&&e.date===today),spent=purchases.filter(p=>p.date>=weekKey&&p.date<=today).reduce((s,p)=>s+p.amount,0),monthSpent=purchases.filter(p=>p.date.startsWith(month)&&p.date<=today).reduce((s,p)=>s+p.amount,0);
if(view==='today')content.innerHTML=`${pouchEntryMarkup()}<h3>Summary</h3>${todayTotals(total)}<section class="purchase-section" aria-labelledby="purchase-title"><div class="row pouch-entry-heading"><h2 id="purchase-title">Add purchase</h2><button type="button" class="add-entry-icon" data-action="purchase" aria-label="Add purchase entry">${addEntryIcon}</button></div><h3>Spending</h3><div class="totals spending-totals"><div><div class="value">${money(spent)}</div><div class="caption">Week</div></div><div><div class="value">${money(monthSpent)}</div><div class="caption">Month</div></div></div></section><details class="recent"><summary>Recent entries <svg class="chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>${rows(entries.filter(e=>e.date===today).slice(0,3),false,true)}</details>`;
if(view==='history')content.innerHTML=`<h2 class="page-heading">History</h2>${weeklyHistory()}`;
if(view==='trends')content.innerHTML=trendsMarkup(monthSpent);
if(view==='resources')content.innerHTML=window.pouchResources;
if(view==='settings')content.innerHTML=`<h2 class="page-heading">Settings</h2><section class="settings-section" aria-labelledby="default-product-title"><h3 id="default-product-title">Default product</h3><div class="row"><span>${esc(product.brand)}, ${product.mg} mg</span><button class="link" data-action="product">Change</button></div></section>${taperingSettings()}<section class="settings-section" aria-labelledby="product-options-title"><h3 id="product-options-title">Brands and strengths</h3><div class="entry-actions"><button class="link" data-action="brand-option">Add brand</button><button class="link" data-action="strength-option">Add strength</button></div><p class="caption" id="product-options-status" role="status" aria-live="polite"></p></section><section class="settings-section" aria-labelledby="your-data-title"><h3 id="your-data-title">Your data</h3><p class="caption entry-note">Logs are saved on this device. Export a backup before clearing browser data or switching phones.</p><div class="entry-actions"><button class="link" data-action="export">Export backup</button><button class="link" data-action="restore">Restore backup</button></div><input type="file" id="backup-file" accept="application/json,.json" hidden></section><section class="settings-section" aria-labelledby="app-updates-title"><h3 id="app-updates-title">App updates</h3><div class="caption">Check for the latest app files and reload. Your saved logs and settings stay on this device.</div><div class="form-actions"><button class="primary" data-action="update">Update app</button></div><p id="update-status" role="status" aria-live="polite"></p></section>`;
}

function formatAmount(value){return Number(value.toFixed(2)).toString();}
function todayTotals(today){
  const count=today.length,nicotine=today.reduce((sum,e)=>sum+e.mg,0),plan=PouchTaper.plan(entries,tapering);
  if(!plan.active)return '<div class="totals"><div><div class="value">'+count+'</div><div class="caption">Pouches</div></div><div><div class="value">'+nicotine+' <small>mg</small></div><div class="caption">Nicotine</div></div></div>'+(tapering.enabled?'<p class="caption">No pouch logs from last week to set a target yet.</p>':'');
  const pouches=plan.countTarget-count,mg=Math.round((plan.nicotineTarget-nicotine)*100)/100;
  return '<div class="totals"><div><div class="value">'+Math.abs(pouches)+'</div><div class="caption">'+(pouches<0?'Pouches over target':'Pouches remaining')+'</div></div><div><div class="value">'+formatAmount(Math.abs(mg))+' <small>mg</small></div><div class="caption">'+(mg<0?'Nicotine over target':'Nicotine remaining')+'</div></div></div>';
}
function taperingSettings(){
  const plan=PouchTaper.plan(entries,tapering);
  const baseline=plan.days?'Last week: '+plan.start+' – '+plan.end+'. Daily average: '+formatAmount(plan.countAverage)+' pouches / '+formatAmount(plan.nicotineAverage)+' mg, from '+plan.days+' of 7 days with logs.':'No pouch logs from the previous Monday–Sunday week yet.';
  return '<section class="settings-section" aria-labelledby="taper-title"><h3 id="taper-title">Tapering</h3><label class="taper-switch" for="taper-enabled"><span>Enable tapering</span><input id="taper-enabled" type="checkbox" role="switch" '+(tapering.enabled?'checked':'')+'></label><div id="taper-options" '+(tapering.enabled?'':'hidden')+'><label for="taper-percent">Reduction (%)</label><input id="taper-percent" type="number" min="0" max="100" step="0.1" inputmode="decimal" value="'+tapering.percent+'" aria-describedby="taper-baseline taper-status"><p class="caption" id="taper-baseline">'+baseline+'</p><p class="caption" id="taper-target">'+(plan.active?'Daily guide: '+plan.countTarget+' pouches / '+formatAmount(plan.nicotineTarget)+' mg.':'')+'</p></div><p class="caption setting-status" id="taper-status" role="status" aria-live="polite"></p></section>';
}
function saveTaperingControl(input){
  const enabled=root.querySelector('#taper-enabled'),percent=root.querySelector('#taper-percent'),status=root.querySelector('#taper-status');
  if(input===percent&&(percent.value.trim()===''||!Number.isFinite(Number(percent.value))||Number(percent.value)<0||Number(percent.value)>100)){
    percent.setAttribute('aria-invalid','true');status.textContent='Enter a percentage from 0 to 100.';return;
  }
  const previous=tapering,next={enabled:enabled.checked,percent:input===percent?Number(percent.value):previous.percent};
  tapering=next;
  if(!persist()){tapering=previous;enabled.checked=previous.enabled;percent.value=previous.percent;status.textContent='Not saved. Try again.';return;}
  if(input===enabled)percent.value=String(next.percent);
  percent.removeAttribute('aria-invalid');root.querySelector('#taper-options').hidden=!next.enabled;
  const plan=PouchTaper.plan(entries,next);
  root.querySelector('#taper-target').textContent=plan.active?'Daily guide: '+plan.countTarget+' pouches / '+formatAmount(plan.nicotineTarget)+' mg.':'';
  status.textContent='Saved.';
}
root.addEventListener('change',e=>{if(e.target.id==='taper-enabled')saveTaperingControl(e.target)});
root.addEventListener('input',e=>{if(e.target.id==='taper-percent')saveTaperingControl(e.target)});
function ensureSudoku(){
  if(!sudokuGame){sudokuGame=PouchSudoku.make();cravingStartedAt=Date.now();cravingFinishedAt=0;}
}
function updateCravingTimer(){
  if(view!=='craving')return;
  const timer=content.querySelector('#craving-timer');if(!timer)return;
  const seconds=Math.max(0,Math.floor(((cravingFinishedAt||Date.now())-cravingStartedAt)/1000));
  timer.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
  const status=content.querySelector('#craving-delay-status');
  const message=cravingFinishedAt?'Puzzle complete. Time taken shown above.':'Time spent on this puzzle';
  if(status&&status.textContent!==message)status.textContent=message;
}
function cravingMarkup(){
  ensureSudoku();
  const selected=sudokuGame.selected;
  return '<h2 class="page-heading">Fight the craving</h2><p class="caption">Take a Sudoku break. You can return and log at any time.</p><div class="craving-break"><span id="craving-timer" class="craving-clock" role="timer" aria-label="Puzzle elapsed time"></span></div><p class="caption" id="craving-delay-status" aria-live="polite"></p><h3>Sudoku</h3><p class="caption">Fill each row, column and 2×3 box with 1–6, without repeats.</p><div class="sudoku-grid" role="grid" aria-label="6 by 6 Sudoku puzzle">'+Array.from({length:6},(_,r)=>'<div class="sudoku-row" role="row">'+Array.from({length:6},(_,c)=>{const i=r*6+c,n=sudokuGame.values[i],given=!!sudokuGame.givens[i];return '<div role="gridcell" aria-selected="'+(selected===i)+'"><button type="button" class="sudoku-cell'+(given?' given':'')+(selected===i?' selected':'')+(sudokuConflicts.includes(i)?' conflict':'')+'" data-sudoku-cell="'+i+'" tabindex="'+(selected===i?'0':'-1')+'" aria-label="Row '+(r+1)+', column '+(c+1)+', '+(n||'empty')+(given?', given':'')+'" aria-disabled="'+given+'">'+(n||'')+'</button></div>'}).join('')+'</div>').join('')+'</div><div class="sudoku-keypad" role="group" aria-label="Enter a number">'+Array.from({length:6},(_,i)=>'<button type="button" data-sudoku-number="'+(i+1)+'" '+(sudokuGame.givens[selected]?'disabled':'')+'>'+(i+1)+'</button>').join('')+'</div><div class="entry-actions"><button type="button" class="link" data-sudoku-action="erase">Erase</button><button type="button" class="link" data-sudoku-action="check">Check</button><button type="button" class="link" data-sudoku-action="new">New puzzle</button></div><p class="caption setting-status" role="status" id="sudoku-status">'+esc(sudokuMessage)+'</p><div class="form-actions"><button type="button" class="primary" data-action="leave-craving">'+(pouchDraft?'Return to pouch':'Back to Today')+'</button></div>';
}
function refreshSudoku(focus=true){
  render();if(focus)content.querySelector('[data-sudoku-cell="'+sudokuGame.selected+'"]')?.focus({preventScroll:true});
}
function putSudoku(value){
  if(!sudokuGame||!PouchSudoku.put(sudokuGame,sudokuGame.selected,value))return;
  sudokuConflicts=[];cravingFinishedAt=PouchSudoku.solved(sudokuGame)?(cravingFinishedAt||Date.now()):0;sudokuMessage=PouchSudoku.solved(sudokuGame)?'Puzzle complete. Well done.':'';refreshSudoku();
}
function handleCravingClick(event){
  const b=event.target.closest('button');if(!b)return false;
  const action=b.dataset.action;
  if(action==='prompt-cancel'){root.querySelector('#craving-prompt').close();pendingPouch=null;return true;}
  if(action==='prompt-log'){
    root.querySelector('#craving-prompt').close();if(pendingPouch)commitPouch(pendingPouch);return true;
  }
  if(action==='prompt-sudoku'){
    root.querySelector('#craving-prompt').close();skipCravingPrompt=true;view='craving';pouchFormOpen=false;notice='';
    ensureSudoku();render();content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return true;
  }
  if(action==='leave-craving'){
    view='today';pouchFormOpen=!!pouchDraft;render();content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return true;
  }
  if(b.dataset.sudokuCell!==undefined){sudokuGame.selected=Number(b.dataset.sudokuCell);sudokuMessage='';refreshSudoku();return true;}
  if(b.dataset.sudokuNumber!==undefined){putSudoku(Number(b.dataset.sudokuNumber));return true;}
  if(b.dataset.sudokuAction){
    if(b.dataset.sudokuAction==='erase')putSudoku(0);
    if(b.dataset.sudokuAction==='new'){sudokuGame=PouchSudoku.make();sudokuMessage='';sudokuConflicts=[];cravingStartedAt=Date.now();cravingFinishedAt=0;refreshSudoku();}
    if(b.dataset.sudokuAction==='check'){
      sudokuConflicts=PouchSudoku.conflicts(sudokuGame.values);
      sudokuMessage=PouchSudoku.solved(sudokuGame)?'Puzzle complete. Well done.':sudokuConflicts.length?sudokuConflicts.length+' cells repeat a number in a row, column or 2×3 box.':'No conflicts so far. '+sudokuGame.values.filter(n=>!n).length+' cells left.';
      refreshSudoku(false);
    }return true;
  }
  return false;
}
root.addEventListener('keydown',event=>{
  const cell=event.target.closest('[data-sudoku-cell]');if(!cell||!sudokuGame)return;
  if(/^[1-6]$/.test(event.key)){event.preventDefault();putSudoku(Number(event.key));return;}
  if(['Backspace','Delete','0'].includes(event.key)){event.preventDefault();putSudoku(0);return;}
  const index=Number(cell.dataset.sudokuCell),row=Math.floor(index/6),col=index%6;
  let next=index;
  if(event.key==='ArrowRight')next=row*6+Math.min(5,col+1);
  if(event.key==='ArrowLeft')next=row*6+Math.max(0,col-1);
  if(event.key==='ArrowDown')next=Math.min(5,row+1)*6+col;
  if(event.key==='ArrowUp')next=Math.max(0,row-1)*6+col;
  if(event.key==='Home')next=row*6;
  if(event.key==='End')next=row*6+5;
  if(next!==index){event.preventDefault();sudokuGame.selected=next;refreshSudoku();}
});

function trendModeIcon(spending){
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${spending?'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 5v14m4-11c-1-2-8-2-8 1 0 4 8 2 8 6 0 3-7 3-8 1"/>':'<rect x="6" y="3" width="12" height="18" rx="5"/><path d="M8 10h8"/>'}</svg>`;
}
function trendsMarkup(monthSpent){
  const end=new Date();end.setHours(12,0,0,0);end.setDate(end.getDate()-trendOffset*7);
  const dates=Array.from({length:7},(_,i)=>{const d=new Date(end);d.setDate(d.getDate()-6+i);return d});
  const daily=dates.map(d=>entries.filter(e=>e.type==='pouch'&&e.date===localDate(d)));
  const counts=daily.map(rows=>rows.length||null),loggedDays=daily.filter(rows=>rows.length).length;
  const nicotineTotals=daily.map(rows=>rows.length?Number(rows.reduce((sum,e)=>sum+e.mg,0).toFixed(2)):null);
  const total=daily.flat(),average=loggedDays?(total.length/loggedDays).toFixed(1):'—';
  const nicotine=loggedDays?(total.reduce((sum,e)=>sum+e.mg,0)/loggedDays).toFixed(1):'—';
  const earliest=(spendingTrends&&!activityTrends?purchases:entries.filter(e=>e.type==='pouch')).map(e=>e.date).sort()[0];
  const canGoBack=earliest&&earliest<localDate(dates[0]);
  const dateLabel=d=>d.toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'});
  const days=dates.map(d=>localDate(d)===localDate(new Date())?'Today':d.toLocaleDateString([], {weekday:'short'}));
  const peak=Math.max(1,...nicotineTotals.filter(n=>n!==null));
  const arrow=direction=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${direction==='previous'?'m15 6-6 6 6 6':'m9 6 6 6-6 6'}"/></svg>`;
  const period=`<div class="row pouch-entry-heading"><h2>${activityTrends?'Activities':'Trends'}</h2><button type="button" class="add-entry-icon" ${activityTrends?'hidden':''} data-action="toggle-trends" aria-label="${spendingTrends?'Show nicotine trends':'Show spending trends'}" aria-pressed="${spendingTrends}">${trendModeIcon(!spendingTrends)}</button></div><div class="trend-period"><button type="button" class="link" data-trend="previous" aria-label="Previous seven days" ${canGoBack?'':'disabled'}>${arrow('previous')}</button><span class="caption" aria-live="polite">${dateLabel(dates[0])} – ${dateLabel(end)}</span><button type="button" class="link" data-trend="next" aria-label="Next seven days" ${trendOffset?'':'disabled'}>${arrow('next')}</button></div>`;
  const activityLink=`<div class="trend-view-link"><button type="button" class="link" data-action="activities"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 13 11 22 2 13V3h10l8 10Z"/><circle cx="7" cy="8" r="1"/></svg>Activities</button></div>`;
  if(activityTrends)return `${period}${activityChart(total)}<div class="trend-view-link"><button type="button" class="link" data-action="close-activities">${trendModeIcon(spendingTrends)}${spendingTrends?'Spending trends':'Nicotine trends'}</button></div>`;
  if(spendingTrends){
    const purchaseDays=dates.map(d=>purchases.filter(p=>p.date===localDate(d)));
    const amounts=purchaseDays.map(rows=>rows.reduce((sum,p)=>sum+p.amount,0));
    const maximum=Math.max(1,...amounts),weekTotal=amounts.reduce((sum,n)=>sum+n,0);
    const monthTotal=purchases.filter(p=>p.date.startsWith(localDate(end).slice(0,7))&&p.date<=localDate(end)).reduce((sum,p)=>sum+p.amount,0);
    return `${period}<h3>Spending logged</h3><div class="bars" role="group" aria-label="Daily spending: ${amounts.map((n,i)=>dateLabel(dates[i])+': '+(purchaseDays[i].length?money(n):'no purchases')).join(', ')}">${amounts.map((n,i)=>{const tins=purchaseDays[i].reduce((sum,p)=>sum+p.tins,0);return `<button type="button" class="column trend-day" data-day="${i}" aria-label="${dateLabel(dates[i])}: ${purchaseDays[i].length?money(n)+', show tins':'no purchases'}" aria-pressed="false" ${purchaseDays[i].length?'':'disabled'}><span>${purchaseDays[i].length?money(n):'—'}</span><span class="bar" style="height:${n/maximum*100}px"><span class="bar-nicotine" hidden>${tins} tin${tins===1?'':'s'}</span></span><small>${days[i]}</small></button>`}).join('')}</div><h3 class="trend-averages-heading">Spending averages</h3><div class="totals trend-averages"><div><div class="value">${money(weekTotal)}</div><div class="caption">Week</div></div><div><div class="value">${money(monthTotal)}</div><div class="caption">Month</div></div></div>${activityLink}`;
  }
  return `${period}
  <h3>Nicotine logged</h3><div class="bars nicotine-bars" role="group" aria-label="Daily nicotine logged: ${nicotineTotals.map((n,i)=>dateLabel(dates[i])+': '+(n===null?'no logs':n+' mg')).join(', ')}">${nicotineTotals.map((n,i)=>`<button type="button" class="column trend-day" data-day="${i}" aria-label="${dateLabel(dates[i])}: ${n===null?'no logs':n+' mg, '+counts[i]+' pouch'+(counts[i]===1?'':'es')+', show pouch count'}" aria-pressed="false" ${n===null?'disabled':''}><span>${n===null?'—':n+' mg'}</span><span class="bar" style="height:${n===null?0:n/peak*100}px"><span class="bar-nicotine" hidden>${counts[i]||0} <br class="pouch-count-break">${counts[i]===1?'Pouch':'Pouches'}</span></span><small>${days[i]}</small></button>`).join('')}</div>
  <h3 class="trend-averages-heading">Seven-day averages</h3><div class="totals trend-averages"><div><div class="value">${average}</div><div class="caption">Pouches</div></div><div><div class="value">${nicotine} <small>mg</small></div><div class="caption">Nicotine</div></div></div>${activityLink}`;
}
function activityChart(pouches){
  if(!pouches.length)return '<h3>Pouches by activity</h3><p class="caption">No pouches logged in this period.</p>';
  const counts=new Map();pouches.forEach(entry=>{const label=entry.activity?.trim()||'Not specified';counts.set(label,(counts.get(label)||0)+1)});
  const palette=['#3b8066','#d28b45','#537da8','#ad6384','#828544','#7666a6','#b56551','#3d9295','#b19b47','#8c7062','#668cba','#8a9690'];
  const groups=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  let offset=0;
  const data=groups.map(([label,count])=>{const index=activityOptions.indexOf(label);const color=palette[index<0?11:index];const slice={label,count,color,percent:count/pouches.length*100,offset};offset+=slice.percent;return slice});
  return `<h3>Pouches by activity</h3><figure class="activity-chart"><svg class="activity-pie" viewBox="0 0 200 200" role="group" aria-label="${pouches.length} pouches logged; select an activity slice">${data.map((item,index)=>{
    const start=`<g class="activity-slice" data-activity-slice="${index}" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(item.label)}, ${item.count} pouches, ${Math.round(item.percent)} percent">`;
    if(item.percent===100)return `${start}<circle cx="100" cy="100" r="84" fill="${item.color}"/></g>`;
    const point=percent=>{const angle=(percent/100*360-90)*Math.PI/180;return `${100+84*Math.cos(angle)} ${100+84*Math.sin(angle)}`};
    return `${start}<path d="M100 100 L${point(item.offset)} A84 84 0 ${item.percent>50?1:0} 1 ${point(item.offset+item.percent)} Z" fill="${item.color}"/></g>`;
  }).join('')}</svg></figure><ul class="activity-legend" aria-label="Pouches by activity">${data.map((item,index)=>`<li data-activity-row="${index}"><span class="activity-swatch" style="background:${item.color}" aria-hidden="true"></span><span>${esc(item.label)}</span><span class="activity-share">${Math.round(item.percent)}% <small>(${item.count})</small></span></li>`).join('')}</ul><div class="activity-total row"><span>TOTAL</span><span>${pouches.length} ${pouches.length===1?'pouch':'pouches'}</span></div>`;
}
function selectActivitySlice(slice){
  const selected=slice.getAttribute('aria-pressed')!=='true';
  content.querySelectorAll('[data-activity-slice]').forEach(item=>item.setAttribute('aria-pressed',String(selected&&item===slice)));
  content.querySelectorAll('[data-activity-row]').forEach(row=>row.classList.toggle('selected',selected&&row.dataset.activityRow===slice.dataset.activitySlice));
}
root.addEventListener('keydown',event=>{const slice=event.target.closest('[data-activity-slice]');if(slice&&(event.key==='Enter'||event.key===' ')){event.preventDefault();selectActivitySlice(slice)}});
function form(kind){notice='';let fields='';
if(kind==='brand-option')fields='<label for="custom-brand">Brand</label><input id="custom-brand" name="value" type="text" maxlength="60" required autocomplete="off" placeholder="Crave">';
if(kind==='strength-option')fields='<label for="custom-strength">Nicotine per pouch (mg)</label><input id="custom-strength" name="value" type="number" min="0" max="1000" step="0.01" inputmode="decimal" required>';
if(kind==='product')fields=entryPicker('brand','Brand',brandValues().map(value=>({value,label:value})),product.brand,'-default')+entryPicker('mg','Nicotine per pouch',strengthValues().map(mg=>({value:String(mg),label:`${mg} mg`})),product.mg,'-default');
if(kind==='craving')fields=`<label for="pp-intensity">Intensity · 1 mild, 5 strongest</label><select id="pp-intensity" name="intensity">${[1,2,3,4,5].map(n=>`<option ${n===3?'selected':''}>${n}</option>`).join('')}</select><label for="pp-replacement">Replacement or delay · optional</label><input id="pp-replacement" name="replacement" placeholder="e.g. gum, walk, wait 10 minutes" maxlength="120">`;
if(kind==='purchase')fields=`${entryPicker('brand','Brand',brandValues().map(value=>({value,label:value})),'Zyn','-purchase')}<label for="pp-tins">Number of tins</label><input id="pp-tins" name="tins" type="number" min="1" step="1" required value="1"><label for="pp-amount">Total paid ($)</label><input id="pp-amount" name="amount" type="number" min="0" step="0.01" required placeholder="8.00"><label for="pp-date">Purchase date</label><input id="pp-date" name="date" type="date" required value="${localDate(new Date())}">`;
content.innerHTML=`<h2>${kind==='brand-option'?'Add brand':kind==='strength-option'?'Add strength':kind==='product'?'Change product':kind==='craving'?'Log craving':'Log purchase'}</h2><form data-kind="${kind}">${fields}<div class="form-actions"><button class="primary" type="submit">Save</button><button type="button" data-action="cancel">Cancel</button></div></form>`;
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
root.addEventListener('click',e=>{if(handleCravingClick(e))return;const slice=e.target.closest('[data-activity-slice]');if(slice){selectActivitySlice(slice);return;}const articleLink=e.target.closest('.resource-contents a[href^="#"]');if(articleLink){e.preventDefault();scrollToResourceSection(articleLink);return;}const b=e.target.closest('button, .brand');if(!b)return;if(b.dataset.day!==undefined){const shown=b.getAttribute('aria-pressed')==='true';content.querySelectorAll('.trend-day').forEach(day=>{day.setAttribute('aria-pressed','false');day.querySelector('.bar-nicotine').hidden=true;});if(!shown){b.setAttribute('aria-pressed','true');b.querySelector('.bar-nicotine').hidden=false;}return;}if(b.dataset.trend){trendOffset=Math.max(0,trendOffset+(b.dataset.trend==='previous'?1:-1));render();return;}if(b.dataset.edit){editRecord(b,true);return;}if(b.dataset.editCancel){editRecord(b,false);return;}if(b.dataset.view){e.preventDefault();setMenuOpen(false);view=b.dataset.view;notice='';pouchFormOpen=false;pouchDraft=null;pendingPouch=null;skipCravingPrompt=false;if(view==='craving')ensureSudoku();clearTimeout(feedbackTimer);render();content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return}if(b.dataset.delete){const id=Number(b.dataset.delete);entries=entries.filter(x=>x.id!==id);purchases=purchases.filter(x=>x.id!==id);persist();notice='';render();return}const a=b.dataset.action;if(a==='activities'||a==='close-activities'){activityTrends=a==='activities';render();content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});return;}if(a==='toggle-trends'){spendingTrends=!spendingTrends;trendOffset=0;render();return;}if(a==='update'){updateApp(b);return}if(a==='open-pouch'){if(pouchFormOpen){closePouchEntry();return;}pouchFormOpen=true;notice='';clearTimeout(feedbackTimer);render();content.querySelector('[data-action="open-pouch"]').focus({preventScroll:true});}else if(a==='cancel-pouch'){closePouchEntry();}else if(a==='undo'){const previous=entries;entries=entries.filter(e=>e.id!==lastAdded);if(!persist()){entries=previous;return;}closePouchEntry();}else if(a==='export'){const blob=new Blob([JSON.stringify({version:1,product,entries,purchases,options:customOptions,tapering},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='pouch-tracker-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}else if(a==='restore'){root.querySelector('#backup-file').click()}else if(a==='cancel')render();else if(a)form(a)});
root.addEventListener('input',e=>{if(e.target.matches('[name="value"],.record-form textarea'))e.target.setCustomValidity('')});
root.addEventListener('submit',e=>{e.preventDefault();const f=e.target,d=new FormData(f),kind=f.dataset.kind;if(kind==='brand-option'||kind==='strength-option'){saveCustomOption(f,kind,d);return;}if(kind==='pouch'){addPouchFromForm(f);return;}if(kind==='record'){saveRecord(f);return;}const previousProduct=product,previousPurchases=[...purchases];if(kind==='product'){const brand=d.get('brand'),mg=Number(d.get('mg'));if(!brandValues().includes(brand)||!strengthValues().includes(mg))return;product={brand,mg};}else if(kind==='craving')entries.unshift({id:Date.now(),type:kind,intensity:Number(d.get('intensity')),replacement:d.get('replacement'),time:time()});else purchases.unshift({id:Date.now(),type:kind,brand:d.get('brand'),tins:Number(d.get('tins')),amount:Number(d.get('amount')),date:d.get('date'),time:d.get('date')});if(!persist()){product=previousProduct;purchases=previousPurchases;return;}render()});
root.addEventListener('change',async e=>{
  if(e.target.id!=='backup-file'||!e.target.files[0])return;
  let backup;
  try{backup=JSON.parse(await e.target.files[0].text());if(!validBackup(backup))throw Error();}
  catch{alert('This is not a valid Pouch Tracker backup.');e.target.value='';return;}
  if(!confirm('Replace device logs with this backup?')){e.target.value='';return;}
  const previous={product,entries,purchases,customOptions,tapering};
  product=backup.product;entries=backup.entries;purchases=backup.purchases;customOptions=readCustomOptions(backup.options);tapering=PouchTaper.read(backup.tapering);
  if(!persist()){({product,entries,purchases,customOptions,tapering}=previous);e.target.value='';return;}
  render();alert('Backup restored.');
});

render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js');
})();
