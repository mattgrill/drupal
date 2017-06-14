<?php

namespace Drupal\Tests\field_ui\FunctionalJavascript;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\FunctionalJavascriptTests\JavascriptTestBase;

/**
 * Tests the JavaScript functionality of the toolbar.
 *
 * @group field_ui
 */
class FieldUiIntegrationTest extends JavascriptTestBase {

  /**
   * {@inheritdoc}
   */
  public static $modules = ['field_ui', 'field', 'text'];

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $admin_user = $this->drupalCreateUser([
      'administer user display',
    ]);
    $this->drupalLogin($admin_user);

    FieldStorageConfig::create([
      'entity_type' => 'user',
      'field_name' => 'field_text_test',
      'type' => 'string',
      'cardinality' => FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED,
    ])->save();
    FieldConfig::create([
      'entity_type' => 'user',
      'field_name' => 'field_text_test',
      'bundle' => 'user',
    ])->save();
    entity_get_display('user', 'user', 'default')
      ->setComponent('field_text_test', ['region' => 'content', 'type' => 'string'])
      ->save();
  }

  /**
   * Tests if the field formatter settings edit button can be operated with the
   * keyboard ENTER key.
   */
  public function testFieldUiFormatterSettingsButtonKeyboardEnter() {
    // Get a Field UI manage-display page.
    $this->drupalGet('admin/config/people/accounts/display');
    $assertSession = $this->assertSession();
    $session = $this->getSession();
    $page = $session->getPage();

    $assertSession->waitForElementVisible('css', 'input[data-drupal-selector=edit-fields-field-text-test-settings-edit]');


    $enter_key_event = <<<JS
jQuery('input[data-drupal-selector=edit-fields-field-text-test-settings-edit]')
  .trigger(jQuery.Event('keypress', {
    which: 13
  }));
JS;
    // PhantomJS driver has buggy, we sent JavaScript key event instead.
    // @todo: use WebDriver event when we remove PhantomJS driver.
    $session->executeScript($enter_key_event);

    // We expect a checkbox for the string formatter's link-to-entity setting.
    $checkbox = $assertSession->waitForElementVisible('css', 'input[data-drupal-selector=edit-fields-field-text-test-settings-edit-form-settings-link-to-entity]');
    $this->assertTrue($checkbox, 'After pressing formatter settings button, formatter settings fields are present.');

    // We expect the edit button has gone.
    $button = $page->find('css', 'input[data-drupal-selector=edit-fields-field-text-test-settings-edit]');
    $this->assertTrue(empty($button), 'After pressing field formatter settings button, it should no longer be present.');
  }
}
