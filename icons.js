// Material Icons Outlined by Google, Apache-2.0. See icons/material/NOTICE.md.
(function(scope){
 const paths={
  "menu": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z\"/>",
  "close": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z\"/>",
  "add": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z\"/>",
  "expand": "<path d=\"M24 24H0V0h24v24z\" fill=\"none\" opacity=\".87\"/><path d=\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z\"/>",
  "previous": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z\"/>",
  "next": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z\"/>",
  "money": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z\"/>",
  "nicotine": "<g><rect fill=\"none\" height=\"24\" width=\"24\"/></g><g><g><rect height=\"11\" width=\"4\" x=\"4\" y=\"9\"/><rect height=\"7\" width=\"4\" x=\"16\" y=\"13\"/><rect height=\"16\" width=\"4\" x=\"10\" y=\"4\"/></g></g>",
  "activity": "<path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"m21.41 11.58-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01 4 11V4h7v-.01l9 9-7 7.02z\"/><circle cx=\"6.5\" cy=\"6.5\" r=\"1.5\"/>"
};
 function svg(name,size=20,className=''){
   if(!Object.hasOwn(paths,name))throw new Error('Unknown icon: '+name);
   return '<svg class="material-icon'+(className?' '+className:'')+'" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="currentColor" aria-hidden="true" focusable="false">'+paths[name]+'</svg>';
 }
 scope.PouchIcons={svg};
})(window);
