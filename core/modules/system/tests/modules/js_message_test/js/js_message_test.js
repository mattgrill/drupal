/**
 * @file
 *  Testing behavior for JSMessageTest.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  var messageObjects = {};
  var messageIndexes = {multiple: []};

  drupalSettings.testMessages.selectors.forEach(function (selector) {
    messageObjects[selector] = new Drupal.message(selector === '' ? undefined : document.querySelector(selector));

    messageIndexes[selector] = {};
    drupalSettings.testMessages.types.forEach(function (type) {
      messageIndexes[selector][type] = [];
    });
  });

  var defaultMessageArea = messageObjects[drupalSettings.testMessages.selectors[0]];

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Add click listeners that show and remove links with context and type.
   */
  Drupal.behaviors.js_message_test = {
    attach: function (context) {

      $('[data-drupal-messages-area]').once('messages-details').on('click', '[data-action]', function (e) {
        var $target = $(e.currentTarget);
        var type = $target.attr('data-type');
        var area = $target.closest('[data-drupal-messages-area]').attr('data-drupal-messages-area');
        var message = messageObjects[area];
        var action = $target.attr('data-action');

        if (action === 'add') {
          messageIndexes[area][type].push(message.add(`This is a message of the type, <strong>${type}</strong>. You be the the judge of its importance. 😜`, {type: type}));
        }
        else if (action === 'remove') {
          message.remove(messageIndexes[area][type].pop());
        }
      });

      $('[data-action="add-multiple"]').once('add-multiple').on('click', function (e) {
        var types = drupalSettings.testMessages.types;
        // Add several of different types to make sure message type doesn't
        // cause issues in the API.
        for (var i = 0; i < types.length * 2; i++) {
          messageIndexes.multiple.push(defaultMessageArea.add(`This is message number ${i} of the type, ${types[i % types.length]}. You be the the judge of its importance. 😜`, {type: types[i % types.length]}));
        }
      });

      $('[data-action="remove-multiple"]').once('remove-multiple').on('click', function (e) {
        defaultMessageArea.remove(messageIndexes.multiple);
        messageIndexes.multiple = [];
      });

      $('[data-action="add-multiple-error"]').once('add-multiple-error').on('click', function (e) {
        // Use the same number of elements to facilitate things on the PHP side.
        var total = drupalSettings.testMessages.types.length * 2;
        for (var i = 0; i < total; i++) {
          defaultMessageArea.add('Msg-' + i, {type: 'error'});
        }
        defaultMessageArea.add('Msg-' + total, {type: 'status'});
      });

      $('[data-action="remove-type"]').once('remove-type').on('click', function (e) {
        defaultMessageArea.remove('error');
      });

      $('[data-action="clear-all"]').once('clear-all').on('click', function (e) {
        defaultMessageArea.clear();
      });

      $('[data-action="id-no-status"]').once('id-no-status').on('click', function (e) {
        defaultMessageArea.add('Msg-id-no-status', {id: 'my-special-id'});
      });

    }
  };

})(jQuery, Drupal, drupalSettings);
