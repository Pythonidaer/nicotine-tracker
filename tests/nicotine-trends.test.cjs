// Run: node tests/nicotine-trends.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const start=source.indexOf('function trendWeek'),end=source.indexOf("function form(kind)",start);
const helpers=source.slice(start,end).split('root.addEventListener')[0];
const make=new Function('now',`
 class Clock extends globalThis.Date {constructor(...args){super(...(args.length?args:[now]));}}
 const Date=Clock,window={PouchIcons:{svg:()=>''}},esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const localDate=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const money=n=>'$'+n.toFixed(2),formatAmount=n=>Number(n.toFixed(2)).toString();
 let trendOffset=0,spendingTrends=false,activityTrends=false,entries=[],purchases=[];
 ${helpers}
 return {week:trendWeek,scale:trendScale,render:trendsMarkup,activity:activityChart,
 records:(p,q=[])=>{entries=p;purchases=q},select:(name,offset=0)=>{spendingTrends=name==='spending';activityTrends=name==='activities';trendOffset=offset}};
`);
const ui=make('2026-10-24T12:00:00');
assert.equal(ui.week()[0].getDay(),1);assert.equal(ui.week()[6].getDay(),0);
assert.equal(ui.week()[0].getDate(),19);assert.equal(ui.week(1)[0].getDate(),12);
const year=make('2027-01-01T12:00:00');assert.equal(year.week()[0].getFullYear(),2026);
assert.equal(year.week()[6].getFullYear(),2027);
ui.records([
 {type:'pouch',date:'2026-10-19',mg:12,activity:'Work'},
 {type:'pouch',date:'2026-10-20',mg:3},{type:'pouch',date:'2026-10-20',mg:3},
 {type:'pouch',date:'2026-10-21',mg:0},
 {type:'pouch',date:'2026-10-22',mg:.1},{type:'pouch',date:'2026-10-22',mg:.2},
 {type:'pouch',date:'2026-10-12',mg:60}
],[{date:'2026-10-20',tins:2,amount:11},{date:'2026-10-21',tins:1,amount:0}]);
let html=ui.render();
assert(html.includes('Nicotine logged'));
assert(html.includes('Scale: 0–60 mg'));
assert(html.includes('height:24px'));
assert(html.includes('height:12px'));
assert(html.includes('Daily average · logged days'));
assert(html.includes('4 of 7 days logged.'));
assert(html.includes('0.3 mg'));
assert(html.includes('bar-label-on-surface'));
assert(html.includes('<option value="activities"'));
ui.select('nicotine',1);assert(ui.render().includes('Scale: 0–60 mg'));
ui.select('spending');html=ui.render();
assert(html.includes('Spending totals'));assert(!html.includes('Spending averages'));
assert(html.includes('$11.00'));assert(html.includes('This week to date'));
assert(html.includes('1<br class="pouch-count-break">Tin'));
ui.select('activities',1);html=ui.render();assert(html.includes('activity-bars'));assert(!html.includes('activity-pie'));assert(html.includes('Total logged'));
const escaped=ui.activity([{activity:'<script>',mg:1},{mg:2}]);
assert(escaped.includes('&lt;script&gt;'));assert(escaped.includes('Not specified'));assert(escaped.includes('50% · 1'));
ui.records([]);ui.select('nicotine');assert(ui.render().includes('No pouches logged this week.'));
const clickStart=source.indexOf('if(b.dataset.day!==undefined)'),clickEnd=source.indexOf('if(b.dataset.trend)',clickStart);
const click=new Function('b','content',source.slice(clickStart,clickEnd));
function day(){const label={hidden:true};let pressed='false';return {dataset:{day:'1'},getAttribute:()=>pressed,setAttribute:(name,value)=>{pressed=value},querySelector:()=>label};}
const first=day(),second=day(),content={querySelectorAll:()=>[first,second]};
click(first,content);assert.equal(first.querySelector().hidden,false);
click(second,content);assert.equal(first.querySelector().hidden,true);assert.equal(second.querySelector().hidden,false);
click(second,content);assert.equal(second.querySelector().hidden,true);
console.log('PASS: calendar weeks/year boundaries, stable cross-week scales, logged-day means, spending totals, activity bars, missing/zero days and count toggles.');
