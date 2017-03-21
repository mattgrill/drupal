/**
 * @file
 * Message API.
 */
(function (Drupal) {

  'use strict';

  var defaultMessageWrapperSelector = '[data-drupal-messages]';

  /**
   * @typedef {object} Drupal.message~messageDefinition
   *
   * @prop {HTMLElement} element
   *   DOM element of the messages wrapper.
   */

  /**
   * woot
   *
   * @param {HTMLElement?} messageWrapper
   *   The zone where to add messages.
   *
   * @return {Drupal.message~messageDefinition}
   *   Object to add and remove messages.
   */
  Drupal.message = function (messageWrapper) {
    if (typeof messageWrapper === 'string') {
      throw new Error(Drupal.t('Drupal.message() expect an HTMLElement as parameter.'));
    }
    if (!messageWrapper) {
      messageWrapper = document.querySelector(defaultMessageWrapperSelector);
      if (!messageWrapper) {
        throw new Error(Drupal.t('There is no @element on the page.', {'%element': defaultMessageWrapperSelector}));
      }
    }

    /**
     * Displays a message on the page.
     *
     * @name Drupal.message~messageDefinition.add
     *
     * @param {string} message
     *   The message to display
     * @param {string} [type=status]
     *   Message type, can be either 'status', 'error' or 'warning'.
     * @param {object} [options]
     *   The context of the message, used for removing messages again.
     *
     * @return {string}
     *   Index of message.
     */
    function messageAdd(message, type, options) {
      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }
      type = type || 'status';
      options = options || {};
      // Send message to screenreader.
      announce(message, type, options);
      // Generate a unique key to allow message deletion.
      options.index = Math.random().toFixed(15).replace('0.', '');
      this.element.innerHTML += Drupal.theme('message', {text: message, type: type}, options);

      return options.index;
    }

    /**
     * Removes messages from the page.
     *
     * @name Drupal.message~messageDefinition.remove
     *
     * @param {Number|String|Array.<string|number>} [messages]
     *   Index of the message to remove, as returned by
     *   {@link Drupal.message~messageDefinition.add}, a number
     *   corresponding to the CSS index of the element, or an
     *   array containing a combination of the previous two types.
     *
     * @return {number}
     *  Number of removed messages.
     */
    function messageRemove(messages) {
      var messagesToRemove = messages instanceof Array ? messages : [messages];
      messagesToRemove.forEach(function (messageIndex) {
        var removeSelector = typeof messageIndex === 'string' ?
          // If it's a string, select corresponding message.
          '[data-drupal-message="' + messageIndex + '"]' :
          // If the index is numeric remove the element based on the DOM index.
          '[data-drupal-message]:nth-child(' + messageIndex + ')';
        var remove = this.element.querySelector(removeSelector);
        this.element.removeChild(remove);
      }.bind(this));

      return messagesToRemove.length;
    }

    return {
      element: messageWrapper,
      add: messageAdd,
      remove: messageRemove
    };
  };

  /**
   * Helper to call Drupal.announce() with the right parameters.
   *
   * @param {string} message
   *   Displayed message.
   * @param {string} type
   *   Message type, can be either 'status', 'error' or 'warning'.
   * @param {object} options
   *   Additional data.
   * @param {string} [options.announce]
   *   Screen-reader version of the message if necessary. To prevent a message
   *   being sent to Drupal.annonce() this should be `''`.
   * @param {string} [options.priority]
   *   Priority of the message for Drupal.announce().
   */
  function announce(message, type, options) {
    // Check this. Might be too much.
    if (!options.priority && type !== 'status') {
      options.priority = 'assertive';
    }
    // If screenreader message is not disabled announce screenreader-specific
    // text or fallback to the displayed message.
    if (options.announce !== '') {
      Drupal.announce(options.announce || message, options.priority);
    }
  }

  /**
   * Theme function for a message.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {string} message.type
   *   The message type.
   * @param {object} [options]
   *   The message context.
   * @param {string} options.index
   *   Index of the message, for reference.
   *
   * @return {string}
   *   A string representing a DOM fragment.
   */
  Drupal.theme.message = function (message, options) {
    return '<div class="messages messages--' + message.type + '" ' +
      'data-drupal-message="' + options.index + '"> ' + message.text + '</div>';
  };

}(Drupal));
