(function(){'use strict';Drupal.debounce=function(a,b,c){var d,e;return function(){for(var f=arguments.length,g=Array(f),h=0;h<f;h++)g[h]=arguments[h];var i=this,k=c&&!d;return clearTimeout(d),d=setTimeout(function(){d=null,c||(e=a.apply(i,g))},b),k&&(e=a.apply(i,g)),e}}})();
//# sourceMappingURL=debounce.js.map
