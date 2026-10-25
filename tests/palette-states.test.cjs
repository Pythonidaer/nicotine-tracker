// Run: node tests/palette-states.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
const totalsSource=app.slice(app.indexOf('function todayTotals'),app.indexOf('function taperingSettings'));
const totals=new Function('plan','today',`
 const entries=[],tapering={enabled:true},PouchTaper={plan:()=>plan},formatAmount=n=>String(n);
 ${totalsSource};return todayTotals(today);
`);
const plan={active:true,countTarget:10,nicotineTarget:60};
const rows=(count,mg=3)=>Array.from({length:count},()=>({mg}));
assert(!totals(plan,rows(7)).includes('target-attention'));
assert.equal((totals(plan,rows(8)).match(/target-attention/g)||[]).length,1);
assert.equal((totals(plan,rows(8,6)).match(/target-attention/g)||[]).length,2);
assert(totals(plan,rows(11,6)).includes('Pouches over target'));
assert(totals(plan,rows(11,6)).includes('Nicotine over target'));
assert(!totals({...plan,active:false},rows(11,6)).includes('target-attention'));
assert(totals({active:true,countTarget:0,nicotineTarget:0},[]).includes('target-attention'));
const saveSource=app.slice(app.indexOf('function saveTaperingControl'),app.indexOf("root.addEventListener('change',e=>{if(e.target.id==='taper-enabled')"));
const percent={value:'101',setAttribute:(k,v)=>{percent[k]=v},removeAttribute:k=>{delete percent[k]}};
const enabled={checked:true},status={dataset:{}},options={},target={};
const map={'#taper-percent':percent,'#taper-enabled':enabled,'#taper-status':status,'#taper-options':options,'#taper-target':target};
const run=new Function('root',`
 let tapering={enabled:true,percent:10},entries=[],save=true;
 const persist=()=>save,PouchTaper={plan:()=>({active:true,countTarget:9,nicotineTarget:54})},formatAmount=n=>String(n);
 ${saveSource};return {input:saveTaperingControl,fail:()=>{save=false}};
`)({querySelector:s=>map[s]});
run.input(percent);assert.equal(status.dataset.state,'error');assert.equal(percent['aria-invalid'],'true');
percent.value='20';run.input(percent);assert.equal(status.dataset.state,undefined);assert.equal(percent['aria-invalid'],undefined);assert.equal(status.textContent,'Saved.');
run.fail();percent.value='25';run.input(percent);assert.equal(status.dataset.state,'error');assert.equal(percent.value,20);
const updateSource=app.slice(app.indexOf('async function updateApp'),app.indexOf("root.addEventListener('click',e=>"));
(async()=>{
 const updateStatus={dataset:{}},button={disabled:false};
 const update=new Function('root','navigator',updateSource+';return updateApp;')({querySelector:()=>updateStatus},{onLine:false});
 await update(button);assert.equal(updateStatus.dataset.state,'error');assert.equal(button.disabled,false);assert(updateStatus.textContent.includes('offline'));
 const theme=fs.readFileSync(path.join(__dirname,'..','theme.js'),'utf8');
 let themeColor;const scope={matchMedia:()=>({matches:false,addEventListener:()=>{}}),dispatchEvent:()=>{}};
 new Function('window','document','localStorage','Event',theme)(scope,{documentElement:{dataset:{},style:{}},querySelector:()=>({setAttribute:(name,value)=>{themeColor=value}})},{getItem:()=>null,setItem:()=>{}},class{});
 assert.equal(themeColor,'#fff1ed');scope.PouchTheme.set('dark');assert.equal(themeColor,'#34232e');
 assert(css.includes('.bar { width: 100%; background: var(--p-data);'));
 assert(css.includes('.pouch-feedback { display: flex; align-items: center; gap: 8px; color: var(--p-muted);'));
 console.log('PASS: independent target attention, neutral logging, invalid/save recovery, update errors and theme metadata.');
})().catch(error=>{console.error(error);process.exitCode=1});
