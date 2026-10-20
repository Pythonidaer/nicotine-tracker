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

const variations=new Set();
for(let i=0;i<25;i++){
  const game=S.make();variations.add(game.givens.join(''));
  assert.equal(game.values.length,9);
  assert.equal(game.givens.filter(Boolean).length,3);
  assert.equal(S.conflicts(game.givens).length,0);
  const given=game.givens.findIndex(Boolean);
  assert.equal(S.put(game,given,0),false);
  assert.equal(S.put(game,-1,4),false);
  assert.equal(S.put(game,9,4),false);
  assert.equal(S.put(game,game.selected,10),false);
  assert.equal(S.put(game,game.selected,game.givens[given]),true);
  assert(S.conflicts(game.values).includes(game.selected));
  assert.equal(S.solved(game),false);
  assert.equal(S.put(game,game.selected,0),true);
  const remaining=[1,2,3,4,5,6,7,8,9].filter(n=>!game.givens.includes(n)).reverse();
  game.givens.forEach((n,index)=>{if(!n)assert(S.put(game,index,remaining.pop()));});
  assert(S.solved(game));
}
assert(variations.size>1);
console.log('PASS: taper baseline and thresholds; 25 single-block puzzles, duplicates, fixed clues and completion.');
