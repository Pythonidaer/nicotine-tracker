// Run: node tests/mobile-layout.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8'),source=read('app.js'),html=read('index.html'),css=read('style.css');
assert(html.includes('class="primary-navigation"'));
const nav=html.match(/<nav class="primary-navigation"[\s\S]*?<\/nav>/)[0];
for(const name of ['Today','History','Trends'])assert(nav.includes('>'+name+'</button>'));
const markupSource=source.slice(source.indexOf('function pouchEntryMarkup'),source.indexOf('// All entry fields'));
const entry=new Function('notice','pouchFormOpen',`
 const pouchDraft=null,product={brand:'Zyn',mg:6},activityOptions=[],addEntryIcon='add',closeEntryIcon='close';
 const entryPicker=()=>'<div>field</div>',brandValues=()=>['Zyn'],strengthValues=()=>[6];
 ${markupSource};return pouchEntryMarkup();
`);
assert(entry('',false).includes('class="entry-row"'));
assert(entry('Pouch added',false).includes('data-action="undo"'));
assert(entry('',true).includes('class="pouch-form"'));
const settingsSource=source.slice(source.indexOf('function settingsMarkup'),source.indexOf('function saveTaperingControl'));
const settings=new Function(`
 const product={brand:'Zyn',mg:6},esc=s=>s,tapering={enabled:false},entries=[],formatAmount=n=>String(n),PouchTaper={plan:()=>({active:false,days:0})};
 ${settingsSource};return settingsMarkup();
`)();
for(const title of ['Tracking preferences','Reduction target','Data and app maintenance'])assert(settings.includes(title));
assert(settings.includes('class="theme-toggle switch-control"'));
assert(settings.includes('class="link" data-action="update"'));
assert(!settings.includes('class="primary" data-action="update"'));
assert(css.includes('--p-body: system-ui'));
assert(css.includes('--p-reading: "Merriweather"'));
assert(css.includes('--p-brand-font: "Oswald"'));
assert(css.includes('width: 100%; padding: 0; border: 0; color: var(--p-accent); font-size: 20px'));
assert(!css.includes('.activity-pie'));
console.log('PASS: persistent tracking navigation, full-row Add pouch, independent Undo, settings groups, shared switch and typography roles.');
