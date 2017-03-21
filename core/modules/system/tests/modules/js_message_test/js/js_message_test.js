/**
 * @file
 *  Testing behavior for JSMessageTest.
 */

(function ($, message) {

  'use strict';

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Add click listeners that show and remove links with context and type.
   */
  Drupal.behaviors.js_message_test = {
    attach: function (context) {
      var message = Drupal.message();
      var messageIndex;
      var messageList = [];
      $('.show-link').once('show-msg').on('click', function (e) {
        e.preventDefault();
        var type = e.currentTarget.getAttribute('data-type');
        messageIndex = message.add('Msg-' + type, type);
        messageList.push(messageIndex);
      });
      $('.remove-link').once('remove-msg').on('click', function (e) {
        e.preventDefault();
        message.remove(messageList);
        messageList = [];
      });
      $('.show-multiple').once('show-msg').on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < 10; i++) {
          messageList.push(message.add('Msg-' + i, 'status'));
        }

      });
      $('.remove-multiple').once('remove-msg').on('click', function (e) {
        e.preventDefault();
        for (var i = 0; i < 10; i++) {
          message.remove(messageList[i]);
        }
        messageList = [];
      });
    }
  };

})(jQuery, Drupal.message);
