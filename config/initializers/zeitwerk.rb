# frozen_string_literal: true

require 'actions'
require 'loader'
require 'view'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/actions'), namespace: Actions)
loader.push_dir(Rails.root.join('lib/loader'), namespace: Loader)
loader.push_dir(Rails.root.join('lib/view'), namespace: View)
