// Run: node tests/feedback-theme.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const theme=fs.readFileSync(path.join(__dirname,'..','theme.js'),'utf8');
function boot(saved,dark=false,blocked=false){
 const data=new Map(saved?[['pouch-tracker-theme',saved]]:[]),events=[];
 const root={dataset:{},style:{}},system={matches:dark,addEventListener:(name,fn)=>{system.change=fn}};
 const scope={matchMedia:()=>system,dispatchEvent:e=>events.push(e.type)};
 const storage={getItem:key=>data.get(key),setItem:(key,value)=>{if(blocked)throw Error('quota');data.set(key,value)}};
 new Function('window','document','localStorage','Event',theme)(scope,{documentElement:root},storage,class{constructor(type){this.type=type}});
 return {api:scope.PouchTheme,root,system,data,events};
}
let page=boot(null,true);assert.equal(page.api.current(),'dark');
page.system.matches=false;page.system.change();assert.equal(page.root.style.colorScheme,'light');
assert.equal(page.api.set('dark'),true);assert.equal(page.data.get('pouch-tracker-theme'),'dark');
page.system.change();assert.equal(page.api.current(),'dark');
assert.equal(boot(page.data.get('pouch-tracker-theme')).api.current(),'dark');
assert.equal(page.api.set('light'),true);assert.equal(page.root.dataset.theme,'light');
assert.equal(page.api.set('invalid'),false);assert.equal(page.api.current(),'light');
assert.equal(boot('invalid',true).api.current(),'dark');
page=boot(null,false,true);assert.equal(page.api.set('dark'),false);assert.equal(page.root.style.colorScheme,'dark');
assert(page.events.includes('pouch-theme-change'));
const markupSource=source.slice(source.indexOf('function pouchEntryMarkup'),source.indexOf('// All entry fields'));
const markup=new Function('notice','pouchFormOpen',`
 const pouchDraft=null,product={brand:'Zyn',mg:6},activityOptions=[],addEntryIcon='add',closeEntryIcon='close';
 const entryPicker=()=>'<div>field</div>',brandValues=()=>['Zyn'],strengthValues=()=>[6];
 ${markupSource};return pouchEntryMarkup();
`);
const success=markup('Pouch added',false);
assert(success.includes('data-action="open-pouch"'));assert(success.includes('data-action="undo"'));
assert(success.indexOf('data-action="open-pouch"')<success.indexOf('class="pouch-feedback"'));
assert(markup('',true).includes('<form data-kind="pouch"'));
const dismissSource=source.slice(source.indexOf('function schedulePouchFeedbackDismissal'),source.indexOf('function addPouchFromForm'));
let callback,removed=false,focused=false;
const feedback={contains:()=>focused,remove:()=>{removed=true}};
const runDismiss=new Function('setTimeout','clearTimeout','content','document',`
 let feedbackTimer=null,notice='Pouch added';
 ${dismissSource};schedulePouchFeedbackDismissal();return ()=>notice;
`);
const getNotice=runDismiss(fn=>{callback=fn;return 1},()=>{}, {querySelector:()=>feedback},{activeElement:{}});
focused=true;callback();assert.equal(removed,false);assert.equal(getNotice(),'Pouch added');
focused=false;callback();assert.equal(removed,true);assert.equal(getNotice(),'');
assert(!dismissSource.includes('outerHTML'));
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert(html.indexOf('theme.js')<html.indexOf('rel="stylesheet"'));
assert(html.includes('id="theme-toggle" type="checkbox" role="switch"'));
console.log('PASS: available Add pouch with independent Undo, safe feedback dismissal, system/manual themes, reload and storage failure.');
