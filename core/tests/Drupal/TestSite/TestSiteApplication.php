<?php

namespace Drupal\TestSite;

use Drupal\TestSite\Commands\TestSiteInstallCommand;
use Drupal\TestSite\Commands\TestSiteInstallModulesCommand;
use Drupal\TestSite\Commands\TestSiteReleaseLocksCommand;
use Drupal\TestSite\Commands\TestSiteTearDownCommand;
use Symfony\Component\Console\Application;

/**
 * Application wrapper for test site commands.
 *
 * In order to see what commands are available and how to use them run
 * "php core/scripts/test-site.php" from command line and use the help system.
 *
 * @internal
 */
class TestSiteApplication extends Application {

  /**
   * {@inheritdoc}
   */
  protected function getDefaultCommands() {
    $default_commands = parent::getDefaultCommands();
    $default_commands[] = new TestSiteInstallCommand();
    $default_commands[] = new TestSiteTearDownCommand();
    $default_commands[] = new TestSiteReleaseLocksCommand();
    $default_commands[] = new TestSiteInstallModulesCommand();
    return $default_commands;
  }

}
