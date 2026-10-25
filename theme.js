// Apply a saved appearance before the stylesheet paints; tracking data is separate.
(function(scope){
  const key='pouch-tracker-theme',root=document.documentElement;
  const system=scope.matchMedia('(prefers-color-scheme: dark)');
  let preference=null;
  try{const saved=localStorage.getItem(key);if(saved==='light'||saved==='dark')preference=saved;}catch{}
  function current(){return preference||(system.matches?'dark':'light');}
  function apply(){
    const mode=current();root.dataset.theme=mode;root.style.colorScheme=mode;
    document.querySelector?.('meta[name="theme-color"]')?.setAttribute('content',mode==='dark'?'#34232e':'#fff1ed');
    scope.dispatchEvent(new Event('pouch-theme-change'));
  }
  function set(mode){
    if(mode!=='light'&&mode!=='dark')return false;
    preference=mode;let saved=true;
    try{localStorage.setItem(key,mode);}catch{saved=false;}
    apply();return saved;
  }
  system.addEventListener('change',()=>{if(!preference)apply();});
  scope.PouchTheme={current,set};apply();
})(window);
