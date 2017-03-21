<?php

namespace Drupal\FunctionalJavascriptTests\Core;

use Drupal\FunctionalJavascriptTests\JavascriptTestBase;
use Drupal\system\Tests\JsMessageTestCases;

/**
 * Tests core/drupal.messages library.
 *
 * @group Javascript
 */
class JsMessageTest extends JavascriptTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['js_message_test'];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    // Enable the theme.
    \Drupal::service('theme_installer')->install(['test_messages']);
    $theme_config = \Drupal::configFactory()->getEditable('system.theme');
    $theme_config->set('default', 'test_messages');
    $theme_config->save();
  }

  /**
   * Test click on links to show messages and remove messages.
   */
  public function testAddRemoveMessages() {
    $web_assert = $this->assertSession();
    $this->drupalGet('js_message_test_link');

    $current_messages = [];
    foreach (JsMessageTestCases::getMessagesSelectors() as $messagesSelector) {
      $web_assert->elementExists('css', $messagesSelector);
      foreach (JsMessageTestCases::getTypes() as $type) {
        $this->clickLink("Show-$messagesSelector-$type");
        $selector = "$messagesSelector .messages.messages--$type";
        $msg_element = $web_assert->waitForElementVisible('css', $selector);
        $this->assertNotEmpty($msg_element, "Message element visible: $selector");
        $web_assert->elementContains('css', $selector, "Msg-$type");
        $current_messages[$selector] = "Msg-$type";
        $this->assertCurrentMessages($current_messages);
      }
      // Remove messages 1 by 1 and confirm the messages are expected.
      foreach (JsMessageTestCases::getTypes() as $type) {
        $this->clickLink("Remove-$messagesSelector-$type");
        $selector = "$messagesSelector .messages.messages--$type";
        // The message for this selector should not be on the page.
        unset($current_messages[$selector]);
        $this->assertCurrentMessages($current_messages);
      }
    }

    // Test adding multiple messages at once.
    // @see processMessages()
    $this->clickLink('Show Multiple');

    $current_messages = [];
    for ($i = 0; $i < 10; $i++) {
      $current_messages[] = "Msg-$i";
    }
    $this->assertCurrentMessages($current_messages);
    $this->clickLink('Remove Multiple');
    $this->assertCurrentMessages([]);
  }

  /**
   * Asserts that currently shown messages match expected messages.
   *
   * @param array $expected_messages
   *   Expected messages.
   */
  protected function assertCurrentMessages(array $expected_messages) {
    $expected_messages = array_values($expected_messages);
    $current_messages = [];
    if ($message_divs = $this->getSession()->getPage()->findAll('css', '.messages')) {
      foreach ($message_divs as $message_div) {
        /** @var \Behat\Mink\Element\NodeElement $message_div */
        $current_messages[] = $message_div->getText();
      }
    }
    $this->assertEquals($expected_messages, $current_messages);
  }

}
