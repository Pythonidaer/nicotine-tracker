// Run: node tests/nicotine-trends.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const trends=source.slice(source.indexOf('function trendsMarkup'),source.indexOf('function activityChart'));
const fixtures="\nlet trendOffset=0,spendingTrends=false,activityTrends=false;\nconst localDate=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');\nconst today=new Date();today.setHours(12,0,0,0);\nconst ago=n=>{const d=new Date(today);d.setDate(d.getDate()-n);return localDate(d)};\nconst entries=[\n{type:'pouch',date:ago(0),mg:3},{type:'pouch',date:ago(0),mg:3},\n{type:'pouch',date:ago(1),mg:12},{type:'pouch',date:ago(2),mg:0},\n{type:'pouch',date:ago(3),mg:0.1},{type:'pouch',date:ago(3),mg:0.2}];\nconst purchases=[{date:ago(0),tins:2,amount:11}];\nconst money=n=>'$'+n.toFixed(2),trendModeIcon=()=>'',activityChart=()=>'<h3>Pouches by activity</h3>';\n";
const iconFixtures=fixtures+'const window={PouchIcons:{svg:()=>""}};';
const render=new Function(iconFixtures+trends+';return {nicotine:trendsMarkup(),spending:(spendingTrends=true,trendsMarkup()),previous:(spendingTrends=false,trendOffset=1,trendsMarkup())}');
const result=render();
assert(result.nicotine.includes('<h3>Nicotine logged</h3>'));
assert(result.nicotine.includes('<span>12 mg</span><span class="bar" style="height:100px">'));
assert(result.nicotine.includes('<span>6 mg</span><span class="bar" style="height:50px">'));
assert(result.nicotine.includes('>2 <br class="pouch-count-break">Pouches</span>'));
assert(result.nicotine.includes('>1 <br class="pouch-count-break">Pouch</span>'));
assert(result.nicotine.includes('<span>0 mg</span>'));
assert(result.nicotine.includes('<span>0.3 mg</span>'));
assert(result.previous.includes('disabled><span>—</span>'));
assert(result.spending.includes('Spending logged')&&result.spending.includes('>2 tins</span>'));
const clickStart=source.indexOf('if(b.dataset.day!==undefined)'),clickEnd=source.indexOf('if(b.dataset.trend)',clickStart);
const click=new Function('b','content',source.slice(clickStart,clickEnd));
function day(){const label={hidden:true};let pressed='false';return {dataset:{day:'1'},getAttribute:()=>pressed,setAttribute:(name,value)=>{pressed=value},querySelector:()=>label};}
const first=day(),second=day(),content={querySelectorAll:()=>[first,second]};
click(first,content);assert.equal(first.getAttribute('aria-pressed'),'true');assert.equal(first.querySelector().hidden,false);
click(second,content);assert.equal(first.getAttribute('aria-pressed'),'false');assert.equal(first.querySelector().hidden,true);assert.equal(second.querySelector().hidden,false);
click(second,content);assert.equal(second.querySelector().hidden,true);
assert(result.nicotine.includes('class="bar-nicotine bar-label-on-surface" hidden>1 <br class="pouch-count-break">Pouch</span>'));
const withShortPurchase=new Function(iconFixtures+trends+';purchases.push({date:ago(1),tins:1,amount:0});spendingTrends=true;return trendsMarkup();')();
assert(withShortPurchase.includes('class="bar-nicotine bar-label-on-surface" hidden>1 tin</span>'));
console.log('PASS: nicotine totals, heights, zero/decimal doses, missing days, pouch reveals, toggle switching and spending regression.');
