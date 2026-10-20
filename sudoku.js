// 6x6 Sudoku: each row, column and 2x3 box contains 1-6 once.
(function(scope){
  const puzzle='100056400003200501060000000000612045';
  const answer='123456456123234561561234345612612345';
  function shuffle(values,random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out;}
  function make(random=Math.random){
    const rows=shuffle([0,1,2],random).flatMap(b=>shuffle([0,1],random).map(r=>b*2+r));
    const cols=shuffle([0,1],random).flatMap(b=>shuffle([0,1,2],random).map(c=>b*3+c));
    const digits=shuffle([1,2,3,4,5,6],random);
    // Rectangular boxes permit band/stack swaps, but not transposition.
    const transform=text=>Array.from({length:36},(_,i)=>{
      const n=Number(text[rows[Math.floor(i/6)]*6+cols[i%6]]);
      return n?digits[n-1]:0;
    });
    const givens=transform(puzzle);
    return {givens,values:[...givens],solution:transform(answer),selected:givens.indexOf(0)};
  }
  function conflicts(values){
    const bad=new Set();
    for(let i=0;i<36;i++){if(!values[i])continue;for(let j=i+1;j<36;j++){
      if(values[i]!==values[j])continue;
      const r=Math.floor(i/6),c=i%6,s=Math.floor(j/6),d=j%6;
      if(r===s||c===d||(Math.floor(r/2)===Math.floor(s/2)&&Math.floor(c/3)===Math.floor(d/3))){bad.add(i);bad.add(j);}
    }}return [...bad];
  }
  function put(game,index,value){if(!Number.isInteger(index)||index<0||index>=36||game.givens[index]||!Number.isInteger(value)||value<0||value>6)return false;game.values[index]=value;return true;}
  function solved(game){return game.values.length===36&&game.values.every(n=>Number.isInteger(n)&&n>=1&&n<=6)&&conflicts(game.values).length===0;}
  scope.PouchSudoku={make,conflicts,put,solved};
})(globalThis);
