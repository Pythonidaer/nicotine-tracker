// Run: node tests/tapering-sudoku.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const scope={};
for(const file of ['tapering.js','sudoku.js'])new Function('globalThis',fs.readFileSync(path.join(__dirname,'..',file),'utf8'))(scope);
const T=scope.PouchTaper,S=scope.PouchSudoku,now=new Date('2026-10-20T12:00:00');
const entries=[];for(let d=12;d<=18;d++)for(let i=0;i<10;i++)entries.push({type:'pouch',date:'2026-10-'+d,mg:6});
const plan=T.plan(entries,{enabled:true,percent:10},now);
assert.equal(plan.start,'2026-10-12');assert.equal(plan.end,'2026-10-18');
assert.equal(plan.countTarget,9);assert.equal(plan.nicotineTarget,54);
assert.equal(T.exceeds(plan,8,48,6),false);assert.equal(T.exceeds(plan,9,54,6),true);
assert.equal(T.exceeds(plan,0,0,60),true);
assert.equal(T.plan(entries,T.read(),now).active,false);
assert.equal(T.plan([],{enabled:true,percent:20},now).active,false);
assert.equal(T.plan(entries,{enabled:true,percent:20},now).nicotineTarget,48);
assert.equal(T.plan(entries,{enabled:true,percent:100},now).countTarget,0);
assert.equal(T.plan(entries.filter(e=>e.date!=='2026-10-12'),{enabled:true,percent:10},now).days,6);
for(const percent of [-1,101,NaN,'10'])assert.throws(()=>T.read({enabled:true,percent}));
function solutions(values,limit=2){
 const grid=[...values];let found=0;
 function go(){if(found>=limit)return;let best=-1,choices=null;
 for(let i=0;i<81;i++){if(grid[i])continue;const used=new Set();const r=Math.floor(i/9),c=i%9;
 for(let j=0;j<9;j++){used.add(grid[r*9+j]);used.add(grid[j*9+c]);used.add(grid[(Math.floor(r/3)*3+Math.floor(j/3))*9+Math.floor(c/3)*3+j%3]);}
 const available=[1,2,3,4,5,6,7,8,9].filter(n=>!used.has(n));if(!available.length)return;
 if(choices===null||available.length<choices.length){best=i;choices=available;if(choices.length===1)break;}}
 if(best<0){found++;return;}for(const n of choices){grid[best]=n;go();if(found>=limit)break;}grid[best]=0;
 }go();return found;
}
const variations=new Set();
for(let i=0;i<25;i++){
  const game=S.make();variations.add(game.givens.join(''));
  assert.equal(S.conflicts(game.givens).length,0);
  assert.equal(solutions(game.givens),1);
  const given=game.givens.findIndex(Boolean);
  assert.equal(S.put(game,given,0),false);
  assert.equal(S.put(game,-1,4),false);
  assert.equal(S.put(game,game.selected,10),false);
  assert(game.givens.every((n,i)=>!n||n===game.solution[i]));
  game.values=[...game.solution];assert(S.solved(game));
}
assert(variations.size>1);
console.log('PASS: taper baseline, percentages, threshold/disabled behavior, and 25 unique-solution Sudoku transformations.');
