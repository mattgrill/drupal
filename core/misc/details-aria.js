(function(){'use strict';(function(a,b){b.behaviors.detailsAria={attach:function(){a('body').once('detailsAria').on('click.detailsAria','summary',function(d){var e=a(d.currentTarget),f='open'===a(d.currentTarget.parentNode).attr('open')?'false':'true';e.attr({'aria-expanded':f,'aria-pressed':f})})}}})(jQuery,Drupal)})();
//# sourceMappingURL=details-aria.js.map
