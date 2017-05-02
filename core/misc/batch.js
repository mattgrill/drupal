

(function ($, Drupal) {
  Drupal.behaviors.batch = {
    attach: function attach(context, settings) {
      var batch = settings.batch;
      var $progress = $('[data-drupal-progress]').once('batch');
      var progressBar = void 0;

      var updateCallback = function updateCallback(progress, status, pb) {
        if (progress === '100') {
          pb.stopMonitoring();
          window.location = batch.uri + '&op=finished';
        }
      };

      var errorCallback = function errorCallback() {
        $progress.prepend($('<p class="error"></p>').html(batch.errorMessage));
        $('#wait').hide();
      };

      if ($progress.length) {
        progressBar = new Drupal.ProgressBar('updateprogress', updateCallback, 'POST', errorCallback);
        progressBar.setProgress(-1, batch.initMessage);
        progressBar.startMonitoring(batch.uri + '&op=do', 10);

        $progress.empty();

        $progress.append(progressBar.element);
      }
    }
  };
})(jQuery, Drupal);