<?php

namespace Drupal\Tests\quickedit\FunctionalJavascript;

use Drupal\FunctionalJavascriptTests\JavascriptTestBase;

/**
 * Tests the UI for missing template values.
 *
 * @group quickedit
 */
class QuickeditTest extends JavascriptTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['contextual', 'field', 'filter', 'quickedit', 'node'];

  /**
   * Node for testing.
   *
   * @var \Drupal\node\NodeInterface
   */
  protected $node;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();
    $this->node = $this->drupalCreateNode();

  }


  public function testMissingAttributeError() {
    $this->drupalGet('node/' . $this->node->id());
    $web_assert = $this->assertSession();
    $this->assertJsCondition()
  }

}
