<?php


namespace Drupal\ajax_forms_test\Form;


use Drupal\ajax_forms_test\Callbacks;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class AjaxFormsTestImageButtonForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ajax_forms_test_image_button_form';
  }
  /**
   * Form constructor.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @return array
   *   The form structure.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $object = new Callbacks();
    $form['image_button'] = [
      '#type' => 'image_button',
      '#name' => 'image_button',
      '#src' => 'core/misc/icons/787878/cog.svg',
      '#attributes' => ['alt' => $this->t('Edit')],
      '#op' => 'edit',
      '#ajax' => [
        'callback' => [$object, 'imageButtonCallback'],
      ],
      '#suffix' => '<div id="ajax_image_button_result">Image button not pressed yet.</div>',
    ];

    return $form;
  }

  /**
   * Form submission handler.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // TODO: Implement submitForm() method.
  }
}
