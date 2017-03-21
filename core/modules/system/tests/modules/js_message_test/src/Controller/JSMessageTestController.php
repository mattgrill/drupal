<?php

namespace Drupal\js_message_test\Controller;

use Drupal\Core\Url;
use Drupal\system\Tests\JsMessageTestCases;

/**
 * Test Controller to show message links.
 */
class JSMessageTestController {

  /**
   * Displays links to show messages via Javascript.
   *
   * @return array
   *   Render array for links.
   */
  public function messageLinks() {
    $links = [];
    foreach (JsMessageTestCases::getMessagesSelectors() as $messagesSelector) {
      foreach (JsMessageTestCases::getTypes() as $type) {
        $links["show-$messagesSelector-$type"] = [
          'title' => "Show-$messagesSelector-$type",
          'url' => Url::fromRoute('js_message_test.links'),
          'attributes' => [
            'id' => "show-$messagesSelector-$type",
            'data-type' => $type,
            'data-selector' => $messagesSelector,
            'class' => ['show-link'],
          ],
        ];
        $links["remove-$messagesSelector-$type"] = [
          'title' => "Remove-$messagesSelector-$type",
          'url' => Url::fromRoute('js_message_test.links'),
          'attributes' => [
            'id' => "remove-$messagesSelector-$type",
            'data-type' => $type,
            'data-selector' => $messagesSelector,
            'class' => ['remove-link'],
          ],
        ];
      }
      $links["remove"] = [
        'title' => "Remove-all",
        'url' => Url::fromRoute('js_message_test.links'),
        'attributes' => [
          'id' => "remove",
          'class' => ['remove-link'],
        ],
      ];
    }

    $links['show-multi'] = [
      'title' => "Show Multiple",
      'url' => Url::fromRoute('js_message_test.links'),
      'attributes' => [
        'class' => ['show-multiple'],
      ],
    ];
    $links['remove-multi'] = [
      'title' => "Remove Multiple",
      'url' => Url::fromRoute('js_message_test.links'),
      'attributes' => [
        'class' => ['remove-multiple'],
      ],
    ];
    return [
      '#theme' => 'links',
      '#links' => $links,
      '#attached' => [
        'library' => [
          'js_message_test/show_message',
        ],
      ],
    ];
  }

}
