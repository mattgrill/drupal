#!/bin/sh

# Check for the existence of core/node_modules
if [ -d "core/node_modules" ]; then
  exit;
else
  # Check for the existence of the Node.js binary
  if hash node 2>/dev/null; then
    # Check for the existence of the Yarn binary.
    # Give users some direction on installing Yarn if missing.
    # @TODO Try and install yarn if missing.
    if hash yarn 2>/dev/null; then
      # Install our JavaScript dependencies with Yarn.
      # Transpile all JavaScript.
      cd core
      yarn
      yarn run build:js
      exit;
    else
      echo "Yarn is required to install Drupal 8 Javascript dependencies.\n" >&2;
      echo "Please install with one of the available methods,\n" >&2;
      echo "https://yarnpkg.com/en/docs/install" >&2;
      exit 1;
    fi
  else
    echo "Node.js is required to install Drupal 8 Javascript dependencies." >&2;
    exit 1;
  fi
fi
