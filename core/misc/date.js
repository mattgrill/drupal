(function(a,b,c){c.behaviors.date={attach:function attach(d){var f=a(d);!0===b.inputtypes.date||f.find('input[data-drupal-date-format]').once('datePicker').each(function(g,h){var i=a(h),j={},k=i.data('drupalDateFormat');j.dateFormat=k.replace('Y','yy').replace('m','mm').replace('d','dd'),i.attr('min')&&(j.minDate=i.attr('min')),i.attr('max')&&(j.maxDate=i.attr('max')),i.datepicker(j)})},detach:function detach(d,e,f){'unload'===f&&a(d).find('input[data-drupal-date-format]').findOnce('datePicker').datepicker('destroy')}}})(jQuery,Modernizr,Drupal);