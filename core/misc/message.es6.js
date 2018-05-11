/**
 * @file
 * Message API.
 */
((Drupal) => {
  /**
   * @typedef {object} Drupal.message~messageDefinition
   */

  /**
   * Constructs a new instance of the Drupal.message object.
   *
   * This provides a uniform interface for adding and removing messages to a
   * specific location on the page.
   *
   * @param {HTMLElement} messageWrapper
   *   The zone where to add messages. If no element is provided an attempt is
   *   made to determine a default location.
   *
   * @return {Drupal.message~messageDefinition}
   *   Object to add and remove messages.
   */

  Drupal.message = class {
    constructor(messageWrapper = null) {
      this.messageWrapper = messageWrapper;
    }

    /**
     * Attempt to determine the default location for
     * inserting JavaScript messages or create one if needed.
     *
     * @return {HTMLElement}
     *   The default destination for JavaScript messages.
     */
    static defaultWrapper() {
      let wrapper = document.querySelector('[data-drupal-messages]');
      if (!wrapper) {
        wrapper = document.querySelector('[data-drupal-messages-fallback]');
        wrapper.removeAttribute('data-drupal-messages-fallback');
        wrapper.setAttribute('data-drupal-messages', '');
        wrapper.removeAttribute('class');
      }
      return wrapper.innerHTML === '' ? Drupal.message.messageInternalWrapper(wrapper) : wrapper.firstElementChild;
    }

    /**
     * Provide an object containing the available message types.
     *
     * @return {Object}
     *   An object containing message type strings.
     */
    static getMessageTypeLabels() {
      return {
        status: Drupal.t('Status message'),
        error: Drupal.t('Error message'),
        warning: Drupal.t('Warning message'),
      };
    }

    /**
     * Sequentially adds a message to the message area.
     *
     * @name Drupal.message~messageDefinition.add
     *
     * @param {string} message
     *   The message to display
     * @param {object} [options]
     *   The context of the message, used for removing messages again.
     * @param {string} [options.id]
     *   The message ID, it can be a simple value: `'filevalidationerror'`
     *   or several values separated by a space: `'mymodule formvalidation'`
     *   which can be used as a sort of tag for message deletion.
     * @param {string} [options.type=status]
     *   Message type, can be either 'status', 'error' or 'warning'.
     * @param {string} [options.announce]
     *   Screen-reader version of the message if necessary. To prevent a message
     *   being sent to Drupal.announce() this should be `''`.
     * @param {string} [options.priority]
     *   Priority of the message for Drupal.announce().
     *
     * @return {string}
     *   ID of message.
     */
    add(message, options = {}) {
      if (!this.messageWrapper) {
        this.messageWrapper = Drupal.message.defaultWrapper();
      }
      if (!options.hasOwnProperty('type')) {
        options.type = 'status';
      }

      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      // Send message to screen reader.
      Drupal.message.announce(message, options);
      /**
       * Use the provided index for the message or generate a unique key to
       * allow message deletion.
       */
      options.id = options.id ?
        String(options.id) :
        `${options.type}-${Math.random().toFixed(15).replace('0.', '')}`;

      // Throw an error if an unexpected message type is used.
      if (!(Drupal.message.getMessageTypeLabels().hasOwnProperty(options.type))) {
        throw new Error(`The message type, ${options.type}, is not present in Drupal.message.getMessageTypeLabels().`);
      }

      this.messageWrapper.appendChild(Drupal.theme('message', { text: message }, options));

      return options.id;
    }

    /**
     * Select a set of messages based on index.
     *
     * @name Drupal.message~messageDefinition.select
     *
     * @param {string|Array.<string>} index
     *   The message index to delete from the area.
     *
     * @return {NodeList|Array}
     *   Elements found.
     */
    select(index) {
      // When there are nothing to select, return an empty list.
      if (!index || (Array.isArray(index) && index.length === 0)) {
        return [];
      }

      // Construct an array of selectors based on the available message index(s).
      const selectors = (Array.isArray(index) ? index : [index])
        .map(currentIndex => `[data-drupal-message-id^="${currentIndex}"]`);

      return this.messageWrapper.querySelectorAll(selectors.join(','));
    }

    /**
     * Helper to remove elements.
     *
     * @param {NodeList|Array.<HTMLElement>} elements
     *   DOM Nodes to be removed.
     *
     * @return {number}
     *  Number of removed nodes.
     */
    removeElements(elements) {
      if (!elements || !elements.length) {
        return 0;
      }

      const length = elements.length;
      for (let i = 0; i < length; i++) {
        this.messageWrapper.removeChild(elements[i]);
      }
      return length;
    }

    /**
     * Removes messages from the message area.
     *
     * @name Drupal.message~messageDefinition.remove
     *
     * @param {string|Array.<string>} ids
     *   Index of the message to remove, as returned by
     *   {@link Drupal.message~messageDefinition.add}, or an
     *   array of indexes.
     *
     * @return {number}
     *   Number of removed messages.
     */
    remove(ids) {
      const messages = this.select(ids);
      return this.removeElements(messages);
    }

    /**
     * Removes all messages from the message area.
     *
     * @name Drupal.message~messageDefinition.clear
     *
     * @return {number}
     *   Number of removed messages.
     */
    clear() {
      const messages = this.messageWrapper.querySelectorAll('[data-drupal-message-id]');
      return this.removeElements(messages);
    }

    /**
     * Helper to call Drupal.announce() with the right parameters.
     *
     * @param {string} message
     *   Displayed message.
     * @param {object} options
     *   Additional data.
     * @param {string} [options.announce]
     *   Screen-reader version of the message if necessary. To prevent a message
     *   being sent to Drupal.announce() this should be `''`.
     * @param {string} [options.priority]
     *   Priority of the message for Drupal.announce().
     * @param {string} [options.type]
     *   Message type, can be either 'status', 'error' or 'warning'.
     */
    static announce(message, options) {
      if (!options.priority && (options.type === 'warning' || options.type === 'error')) {
        options.priority = 'assertive';
      }
      /**
       * If screen reader message is not disabled announce screen reader
       * specific text or fallback to the displayed message.
       */
      if (options.announce !== '') {
        Drupal.announce(options.announce || message, options.priority);
      }
    }

    /**
     * Function for creating the internal message wrapper element.
     *
     * @param {HTMLElement} messageWrapper
     *   The message wrapper.
     *
     * @return {HTMLElement}
     *   The internal wrapper DOM element.
     */
    static messageInternalWrapper(messageWrapper) {
      const innerWrapper = document.createElement('div');
      innerWrapper.setAttribute('class', 'messages__wrapper');
      messageWrapper.insertAdjacentElement('afterbegin', innerWrapper);
      return innerWrapper;
    }
  };

  /**
   * Theme function for a message.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {object} options
   *   The message context.
   * @param {string} options.type
   *   The message type.
   * @param {string} options.id
   *   ID of the message, for reference.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.message = ({ text }, options) => {
    const messagesTypes = Drupal.message.getMessageTypeLabels();
    const messageWraper = document.createElement('div');
    const messageText = document.createElement('h2');
    messageText.setAttribute('class', 'visually-hidden');

    messageWraper.setAttribute('class', `messages messages--${options.type}`);
    messageWraper.setAttribute('role', options.type === 'error' ? 'alert' : 'status');
    messageWraper.setAttribute('data-drupal-message-id', options.id);
    messageWraper.setAttribute('data-drupal-message-type', options.type);

    messageWraper.setAttribute('aria-label', messagesTypes[options.type]);
    messageText.innerHTML = messagesTypes[options.type];

    messageWraper.innerHTML = ` ${text}`;
    messageWraper.insertAdjacentElement('afterbegin', messageText);

    return messageWraper;
  };
})(Drupal);
