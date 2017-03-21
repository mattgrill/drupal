/**
 * @file
 *  Testing behavior for JSMessageTest.
 */

(function ($) {

  'use strict';

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Add click listeners that show and remove links with context and type.
   */
  Drupal.behaviors.js_message_test = {
    attach: function (context) {
      var messageObjects = {};
      var messageIndexes = {};

      $('.show-link').once('show-msg').on('click', function (e) {

        e.preventDefault();
        var type = e.currentTarget.getAttribute('data-type');
        messageIndexes[type] = getMessageObject(e).add('Msg-' + type, type);
      });
      $('.remove-link').once('remove-msg').on('click', function (e) {
        e.preventDefault();
        var type = e.currentTarget.getAttribute('data-type');
        getMessageObject(e).remove(messageIndexes[type]);
      });
      $('.show-multiple').once('show-msg').on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < 10; i++) {
          messageIndexes[i] = getMessageObject(e).add('Msg-' + i, 'status');
        }

      });
      $('.remove-multiple').once('remove-msg').on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < 10; i++) {
          getMessageObject(e).remove(messageIndexes[i]);
        }
      });

      /**
       * Gets message object for the click event.
       *
       * @param {jQuery.Event} e
       *   The click event.
       * @return {Drupal.message~messageDefinition}
       *  The message object for correct div.
       */
      function getMessageObject(e) {
        var divSelector = e.currentTarget.getAttribute('data-selector');
        if (!messageObjects.hasOwnProperty(divSelector)) {
          messageObjects[divSelector] = Drupal.message(document.querySelector(divSelector));
        }
        return messageObjects[divSelector];
      }
    }
  };

})(jQuery);
