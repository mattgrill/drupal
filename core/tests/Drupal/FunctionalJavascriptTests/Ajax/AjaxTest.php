<?php

namespace Drupal\FunctionalJavascriptTests\Ajax;

use Drupal\FunctionalJavascriptTests\JavascriptTestBase;

/**
 * Tests AJAX responses.
 *
 * @group Ajax
 */
class AjaxTest extends JavascriptTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['ajax_test'];

  /**
   * Wrap HTML with an AJAX target div.
   *
   * @param string $html
   *   The HTML to wrap.
   *
   * @return string
   *   The HTML wrapped in the an AJAX target div.
   */
  protected function wrapAjaxTarget($html) {
    return '<div id="ajax-target">' . $html . '</div>';
  }

  public function testAjaxWithAdminRoute() {
    \Drupal::service('theme_installer')->install(['stable', 'seven']);
    $theme_config = \Drupal::configFactory()->getEditable('system.theme');
    $theme_config->set('admin', 'seven');
    $theme_config->set('default', 'stable');
    $theme_config->save();

    $account = $this->drupalCreateUser(['view the administration theme']);
    $this->drupalLogin($account);

    // First visit the site directly via the URL. This should render it in the
    // admin theme.
    $this->drupalGet('admin/ajax-test/theme');
    $assert = $this->assertSession();
    $assert->pageTextContains('Current theme: seven');

    // Now click the modal, which should also use the admin theme.
    $this->drupalGet('ajax-test/dialog');
    $assert->pageTextNotContains('Current theme: stable');
    $this->clickLink('Link 8 (ajax)');
    $assert->assertWaitOnAjaxRequest();

    $assert->pageTextContains('Current theme: stable');
    $assert->pageTextNotContains('Current theme: seven');
  }

  /**
   * Test that AJAX loaded libraries are not retained between requests.
   *
   * @see https://www.drupal.org/node/2647916
   */
  public function testDrupalSettingsCachingRegression() {
    $this->drupalGet('ajax-test/dialog');
    $assert = $this->assertSession();
    $session = $this->getSession();

    // Insert a fake library into the already loaded library settings.
    $fake_library = 'fakeLibrary/fakeLibrary';
    $session->evaluateScript("drupalSettings.ajaxPageState.libraries = drupalSettings.ajaxPageState.libraries + ',$fake_library';");

    $libraries = $session->evaluateScript('drupalSettings.ajaxPageState.libraries');
    // Test that the fake library is set.
    $this->assertContains($fake_library, $libraries);

    // Click on the AJAX link.
    $this->clickLink('Link 8 (ajax)');
    $assert->assertWaitOnAjaxRequest();

    // Test that the fake library is still set after the AJAX call.
    $libraries = $session->evaluateScript('drupalSettings.ajaxPageState.libraries');
    $this->assertContains($fake_library, $libraries);

    // Reload the page, this should reset the loaded libraries and remove the
    // fake library.
    $this->drupalGet('ajax-test/dialog');
    $libraries = $session->evaluateScript('drupalSettings.ajaxPageState.libraries');
    $this->assertNotContains($fake_library, $libraries);

    // Click on the AJAX link again, and the libraries should still not contain
    // the fake library.
    $this->clickLink('Link 8 (ajax)');
    $assert->assertWaitOnAjaxRequest();
    $libraries = $session->evaluateScript('drupalSettings.ajaxPageState.libraries');
    $this->assertNotContains($fake_library, $libraries);
  }

  /**
   * Tests that various AJAX responses with DOM elements are correctly inserted.
   *
   * After inserting DOM elements, Drupal JavaScript behaviors should be
   * reattached and all top-level elements of type Node.ELEMENT_NODE need to be
   * part of the context.
   */
  public function testInsert() {
    $assert = $this->assertSession();
    $this->drupalGet('ajax-test/insert');

    // Test that no additional wrapper is added when inserting already wrapped
    // response data and all top-level node elements (context) are processed
    // correctly.
    $this->clickLink('Link pre-wrapped');
    $assert->assertWaitOnAjaxRequest();
    $assert->responseContains($this->wrapAjaxTarget('<div class="pre-wrapped processed">pre-wrapped</div>'));

    // Test that no additional empty leading div is added when the return
    // value had a leading space and all top-level node elements (context) are
    // processed correctly.
    $this->clickLink('Link pre-wrapped-leading-whitespace');
    $assert->assertWaitOnAjaxRequest();
    $assert->responseContains($this->wrapAjaxTarget('<div class="pre-wrapped-leading-whitespace processed">pre-wrapped-leading-whitespace</div>'));

    // Test that not wrapped response data (text node) is inserted wrapped and
    // all top-level node elements (context) are processed correctly.
    $this->clickLink('Link not-wrapped');
    $assert->assertWaitOnAjaxRequest();
    $assert->responseContains($this->wrapAjaxTarget('<span class="processed">not-wrapped</span>'));

    // Test that top-level comments (which are not lead by text nodes) are
    // inserted without wrapper.
    $this->clickLink('Link comment-not-wrapped');
    $assert->assertWaitOnAjaxRequest();
    $assert->responseContains($this->wrapAjaxTarget('<!-- COMMENT --><div class="comment-not-wrapped processed">comment-not-wrapped</div>'));

    // Test that wrappend and not-wrapped response data is inserted correctly
    // and all top-level node elements (context) are processed correctly.
    $this->clickLink('Link mixed');
    $assert->assertWaitOnAjaxRequest();
    $assert->responseContains($this->wrapAjaxTarget('<span class="processed"> foo <!-- COMMENT -->  foo bar</span><div class="a class processed"><p>some string</p></div><span class="processed"> additional not wrapped strings, <!-- ANOTHER COMMENT --> </span><p class="processed">final string</p>'));
  }

}
