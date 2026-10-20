// Local tracking goals; no treatment schedule is prescribed.
(function(scope){
  function read(value){
    if(value===undefined)return {enabled:false,percent:10};
    if(!value||typeof value.enabled!=='boolean'||typeof value.percent!=='number'||!Number.isFinite(value.percent)||value.percent<0||value.percent>100)throw Error('Invalid tapering settings');
    return {enabled:value.enabled,percent:value.percent};
  }
  function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function plan(entries,settings,now=new Date()){
    const monday=new Date(now);monday.setHours(12,0,0,0);monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const start=new Date(monday);start.setDate(start.getDate()-7);const end=new Date(monday);end.setDate(end.getDate()-1);
    const records=entries.filter(e=>e.type==='pouch'&&e.date>=dateKey(start)&&e.date<=dateKey(end));
    const days=new Set(records.map(e=>e.date)).size;
    const countAverage=days?records.length/days:0,nicotineAverage=days?records.reduce((s,e)=>s+e.mg,0)/days:0;
    const factor=1-settings.percent/100;
    return {active:settings.enabled&&days>0,days,start:dateKey(start),end:dateKey(end),countAverage,nicotineAverage,
      countTarget:Math.floor(countAverage*factor+1e-9),nicotineTarget:Math.round(nicotineAverage*factor*100)/100};
  }
  function exceeds(plan,count,nicotine,nextMg){return plan.active&&(count+1>plan.countTarget||nicotine+nextMg>plan.nicotineTarget+1e-9);}
  scope.PouchTaper={read,plan,exceeds};
})(globalThis);
