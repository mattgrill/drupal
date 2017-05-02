var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, Drupal, drupalSettings) {
  var MachineName = function () {
    function MachineName() {
      _classCallCheck(this, MachineName);

      this.xhr = null;
      this.timeout = null;
    }

    _createClass(MachineName, [{
      key: 'transliterate',
      value: function transliterate(source, settings) {
        return $.get(Drupal.url('machine_name/transliterate'), {
          text: source,
          langcode: drupalSettings.langcode,
          replace_pattern: settings.replace_pattern,
          replace_token: settings.replace_token,
          replace: settings.replace,
          lowercase: true
        });
      }
    }, {
      key: 'showMachineName',
      value: function showMachineName(machine, data) {
        var settings = data.options;

        if (machine !== '') {
          if (machine !== settings.replace) {
            data.$target.val(machine);
            data.$preview.html(settings.field_prefix + Drupal.checkPlain(machine) + settings.field_suffix);
          }
          data.$suffix.show();
        } else {
          data.$suffix.hide();
          data.$target.val(machine);
          data.$preview.empty();
        }
      }
    }, {
      key: 'clickEditHandler',
      value: function clickEditHandler(e) {
        var data = e.data;
        data.$wrapper.removeClass('visually-hidden');
        data.$target.trigger('focus');
        data.$suffix.hide();
        data.$source.off('.machineName');
      }
    }, {
      key: 'machineNameHandler',
      value: function machineNameHandler(e) {
        var data = e.data;
        var options = data.options;
        var baseValue = $(e.target).val();

        var rx = new RegExp(options.replace_pattern, 'g');
        var expected = baseValue.toLowerCase().replace(rx, options.replace).substr(0, options.maxlength);

        if (this.xhr && this.xhr.readystate !== 4) {
          this.xhr.abort();
          this.xhr = null;
        }

        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        if (baseValue.toLowerCase() !== expected) {
          this.timeout = setTimeout(function () {
            Drupal.behaviors.machinename.xhr = Drupal.behaviors.machinename.transliterate(baseValue, options).done(function (machine) {
              Drupal.behaviors.machinename.showMachineName(machine.substr(0, options.maxlength), data);
            });
          }, 300);
        } else {
          Drupal.behaviors.machinename.showMachineName(expected, data);
        }
      }
    }, {
      key: 'attach',
      value: function attach(context, settings) {
        var _this = this;

        var $context = $(context);

        Object.keys(settings.machineName).forEach(function (sourceID) {
          var machine = '';
          var options = settings.machineName[sourceID];
          var $source = $context.find(sourceID).addClass('machine-name-source').once('machine-name');
          var $target = $context.find(options.target).addClass('machine-name-target');
          var $suffix = $context.find(options.suffix);
          var $wrapper = $target.closest('.js-form-item');

          if (!$source.length || !$target.length || !$suffix.length || !$wrapper.length) {
            return;
          }

          if ($target.hasClass('error')) {
            return;
          }

          options.maxlength = $target.attr('maxlength');

          $wrapper.addClass('visually-hidden');

          if ($target.is(':disabled') || $target.val() !== '') {
            machine = $target.val();
          } else if ($source.val() !== '') {
            machine = self.transliterate($source.val(), options);
          }

          var $preview = $('<span class="machine-name-value">' + options.field_prefix + Drupal.checkPlain(machine) + options.field_suffix + '</span>');
          $suffix.empty();
          if (options.label) {
            $suffix.append('<span class="machine-name-label">' + options.label + ': </span>');
          }
          $suffix.append($preview);

          if ($target.is(':disabled')) {
            return;
          }

          var eventData = {
            $source: $source,
            $target: $target,
            $suffix: $suffix,
            $wrapper: $wrapper,
            $preview: $preview,
            options: options
          };

          var $link = $('<span class="admin-link"><button type="button" class="link">' + Drupal.t('Edit') + '</button></span>').on('click', eventData, _this.clickEditHandler);
          $suffix.append($link);

          if ($target.val() === '') {
            $source.on('formUpdated.machineName', eventData, _this.machineNameHandler).trigger('formUpdated.machineName');
          }

          $target.on('invalid', eventData, _this.clickEditHandler);
        });
      }
    }]);

    return MachineName;
  }();

  Drupal.behaviors.machinename = new MachineName();
})(jQuery, Drupal, drupalSettings);