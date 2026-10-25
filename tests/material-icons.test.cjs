// Run: node tests/material-icons.test.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const scope={};new Function('window',read('icons.js'))(scope);
for(const name of ['menu','close','add','expand','previous','next','money','nicotine','activity']){
 const svg=scope.PouchIcons.svg(name,18,'test-icon');
 assert(svg.includes('viewBox="0 0 24 24"'));
 assert(svg.includes('fill="currentColor"'));
 assert(svg.includes('aria-hidden="true"'));
 assert(svg.includes('width="18"'));
 assert(svg.includes('test-icon'));
 assert(!svg.includes('<script'));
}
assert.throws(()=>scope.PouchIcons.svg('unknown'));
const html=read('index.html'),css=read('style.css'),app=read('app.js'),sw=read('sw.js');
assert(html.includes('class="theme-switch-track"'));
assert(html.includes('id="theme-toggle" type="checkbox" role="switch"'));
assert(css.includes('input:checked + .theme-switch-track'));
assert(css.includes('input:focus-visible + .theme-switch-track'));
const menuRule=css.match(/nav \.theme-toggle \{([^}]+)\}/)[1];
assert(menuRule.includes('margin: 16px 0 0'));
assert(menuRule.includes('border: 0'));
assert(!menuRule.includes('border-top'));
assert(css.includes('opacity: 0; width: 1px'));
assert(html.indexOf('icons.js')<html.indexOf('src="./app.js'));
assert(sw.includes('./icons.js?v='));
assert(html.includes('menu-open-icon')&&html.includes('menu-close-icon'));
assert(app.includes("window.PouchIcons.svg('expand',18,'chevron')"));
assert(!app.includes('stroke="currentColor"'));
console.log('PASS: bundled Material icon coverage, custom switch visual/focus hooks, divider removal and offline asset.');
