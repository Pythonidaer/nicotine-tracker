// Transform a fixed, uniquely solvable puzzle to produce fresh boards.
(function(scope){
  const puzzle='530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const answer='534678912672195348198342567859761423426853791713924856961537284287419635345286179';
  function shuffle(values,random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out;}
  function make(random=Math.random){
    const rows=shuffle([0,1,2],random).flatMap(b=>shuffle([0,1,2],random).map(r=>b*3+r));
    const cols=shuffle([0,1,2],random).flatMap(b=>shuffle([0,1,2],random).map(c=>b*3+c));
    const digits=shuffle([1,2,3,4,5,6,7,8,9],random),transpose=random()<.5;
    const transform=text=>Array.from({length:81},(_,i)=>{const row=rows[Math.floor(i/9)],col=cols[i%9],n=Number(text[transpose?col*9+row:row*9+col]);return n?digits[n-1]:0});
    const givens=transform(puzzle);return {givens,values:[...givens],solution:transform(answer),selected:givens.indexOf(0)};
  }
  function conflicts(values){
    const bad=new Set();
    for(let i=0;i<81;i++){if(!values[i])continue;for(let j=i+1;j<81;j++){
      if(values[i]!==values[j])continue;
      const r=Math.floor(i/9),c=i%9,s=Math.floor(j/9),d=j%9;
      if(r===s||c===d||(Math.floor(r/3)===Math.floor(s/3)&&Math.floor(c/3)===Math.floor(d/3))){bad.add(i);bad.add(j)}
    }}return [...bad];
  }
  function put(game,index,value){if(!Number.isInteger(index)||index<0||index>=81||game.givens[index]||!Number.isInteger(value)||value<0||value>9)return false;game.values[index]=value;return true;}
  function solved(game){return game.values.every(n=>n>=1&&n<=9)&&conflicts(game.values).length===0;}
  scope.PouchSudoku={make,conflicts,put,solved};
})(globalThis);
