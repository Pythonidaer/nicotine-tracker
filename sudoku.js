// Mini Sudoku: each row, column and 2x2 box contains 1-4 once.
(function(scope){
  const puzzle='0004001001034020';
  const answer='1234341221434321';
  function shuffle(values,random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out;}
  function make(random=Math.random){
    const rows=shuffle([0,1],random).flatMap(b=>shuffle([0,1],random).map(r=>b*2+r));
    const cols=shuffle([0,1],random).flatMap(b=>shuffle([0,1],random).map(c=>b*2+c));
    const digits=shuffle([1,2,3,4],random),transpose=random()<.5;
    const transform=text=>Array.from({length:16},(_,i)=>{
      const row=rows[Math.floor(i/4)],col=cols[i%4],n=Number(text[transpose?col*4+row:row*4+col]);
      return n?digits[n-1]:0;
    });
    const givens=transform(puzzle);
    return {givens,values:[...givens],solution:transform(answer),selected:givens.indexOf(0)};
  }
  function conflicts(values){
    const bad=new Set();
    for(let i=0;i<16;i++){if(!values[i])continue;for(let j=i+1;j<16;j++){
      if(values[i]!==values[j])continue;
      const r=Math.floor(i/4),c=i%4,s=Math.floor(j/4),d=j%4;
      if(r===s||c===d||(Math.floor(r/2)===Math.floor(s/2)&&Math.floor(c/2)===Math.floor(d/2))){bad.add(i);bad.add(j);}
    }}return [...bad];
  }
  function put(game,index,value){if(!Number.isInteger(index)||index<0||index>=16||game.givens[index]||!Number.isInteger(value)||value<0||value>4)return false;game.values[index]=value;return true;}
  function solved(game){return game.values.length===16&&game.values.every(n=>Number.isInteger(n)&&n>=1&&n<=4)&&conflicts(game.values).length===0;}
  scope.PouchSudoku={make,conflicts,put,solved};
})(globalThis);
