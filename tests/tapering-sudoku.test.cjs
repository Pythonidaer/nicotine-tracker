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

function solve(values,limit=2){
 const grid=[...values],answers=[];
 function go(){
  if(answers.length>=limit)return;
  let cell=-1,choices=[];
  for(let i=0;i<36;i++){if(grid[i])continue;const r=Math.floor(i/6),c=i%6,used=new Set();
   for(let j=0;j<6;j++){used.add(grid[r*6+j]);used.add(grid[j*6+c]);used.add(grid[(Math.floor(r/2)*2+Math.floor(j/3))*6+Math.floor(c/3)*3+j%3]);}
   const available=[1,2,3,4,5,6].filter(n=>!used.has(n));if(!available.length)return;
   if(cell<0||available.length<choices.length){cell=i;choices=available;}
  }
  if(cell<0){answers.push([...grid]);return;}
  for(const n of choices){grid[cell]=n;go();}grid[cell]=0;
 }go();return answers;
}
const variations=new Set();
for(let i=0;i<50;i++){
 const game=S.make();variations.add(game.givens.join(''));
 assert.equal(game.values.length,36);
 assert.equal(game.givens.filter(Boolean).length,14);
 assert.equal(S.conflicts(game.givens).length,0);
 const answers=solve(game.givens);
 assert.equal(answers.length,1);
 assert.equal(answers[0].join(''),game.solution.join(''));
 assert.equal(S.solved(game),false);
 assert.equal(S.put(game,game.givens.findIndex(Boolean),0),false);
 for(const index of [-1,36,1.5])assert.equal(S.put(game,index,1),false);
 for(const n of [-1,7,1.5])assert.equal(S.put(game,game.selected,n),false);
 assert(S.put(game,game.selected,6));
 assert(S.put(game,game.selected,0));
 game.givens.forEach((n,index)=>{if(!n)assert(S.put(game,index,game.solution[index]));});
 assert(S.solved(game));
}
// Same row, same column and rectangular-box-only duplicates.
for(const pair of [[0,5],[0,30],[2,6]]){
 const values=Array(36).fill(0);values[pair[0]]=values[pair[1]]=1;
 assert.equal(S.conflicts(values).sort((a,b)=>a-b).join(','),pair.sort((a,b)=>a-b).join(','));
}
// Different rows, columns and boxes may repeat.
for(const pair of [[0,9],[2,12]]){
 const values=Array(36).fill(0);values[pair[0]]=values[pair[1]]=1;
 assert.equal(S.conflicts(values).length,0);
}
assert(variations.size>1);
console.log('PASS: taper regression and 50 unique 6x6 Sudoku boards; rectangular boxes, input bounds, fixed clues and completion.');
