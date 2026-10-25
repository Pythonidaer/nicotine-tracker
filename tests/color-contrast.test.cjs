// Run: node tests/color-contrast.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const css=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
function pair(token){
 const match=css.match(new RegExp('--'+token+':\\s*light-dark\\((#[a-fA-F0-9]+),\\s*(#[a-fA-F0-9]+)\\)'));
 assert(match,'Missing theme pair: '+token);return match.slice(1);
}
function luminance(hex){
 let h=hex.slice(1);if(h.length===3)h=h.split('').map(c=>c+c).join('');
 return h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const checks=[
 ['p-fg','p-bg',4.5],['p-muted','p-bg',4.5],['p-accent','p-bg',4.5],
 ['p-on','p-action-fill',4.5],['p-control-border','p-bg',3],
 ['p-focus-ring','p-bg',3],['p-focus-on-selected','p-action-fill',3],
 ['p-data','p-bg',3],['p-spending','p-bg',4.5],['p-spending-on','p-spending',4.5],['p-data-on','p-data',4.5],['p-progress','p-bg',4.5],
 ['p-attention','p-bg',4.5],['p-error','p-bg',4.5]
];
for(const [front,back,minimum] of checks){
 const a=pair(front),b=pair(back);
 for(let i=0;i<2;i++)assert(contrast(a[i],b[i])>=minimum,front+'/'+back+' fails in '+(i?'dark':'light')+' theme');
}
assert(css.includes('border: 1px solid var(--p-control-border)'));
assert(css.includes('[aria-selected="true"]:focus-visible { outline-color: var(--p-focus-on-selected); }'));
assert(css.includes('.trend-day:hover .bar-nicotine[hidden] { display: block !important; }'));
assert(css.includes('.trend-day:focus-visible .bar-nicotine[hidden] { display: block !important; }'));
console.log('PASS: light/dark text, control boundaries, focus pairs and chart reveal cascade.');
