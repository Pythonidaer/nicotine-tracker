// A single-block number puzzle: use each number from 1 to 9 once.
(function(scope){
  function shuffle(values,random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out;}
  function make(random=Math.random){
    const solution=shuffle([1,2,3,4,5,6,7,8,9],random);
    const fixed=new Set(shuffle([0,1,2,3,4,5,6,7,8],random).slice(0,3));
    const givens=solution.map((n,i)=>fixed.has(i)?n:0);
    return {givens,values:[...givens],selected:givens.indexOf(0)};
  }
  function conflicts(values){return values.map((n,i)=>n&&values.some((other,j)=>j!==i&&other===n)?i:-1).filter(i=>i>=0);}
  function put(game,index,value){if(!Number.isInteger(index)||index<0||index>=9||game.givens[index]||!Number.isInteger(value)||value<0||value>9)return false;game.values[index]=value;return true;}
  function solved(game){return game.values.length===9&&game.values.every(n=>Number.isInteger(n)&&n>=1&&n<=9)&&conflicts(game.values).length===0;}
  scope.PouchSudoku={make,conflicts,put,solved};
})(globalThis);
