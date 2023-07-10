# frozen_string_literal: true

require 'actions'
require 'loader'
require 'responders'
require 'utils'
require 'view'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/actions'), namespace: Actions)
loader.push_dir(Rails.root.join('lib/loader'), namespace: Loader)
loader.push_dir(Rails.root.join('lib/responders'), namespace: Responders)
loader.push_dir(Rails.root.join('lib/utils'), namespace: Utils)
loader.push_dir(Rails.root.join('lib/view'), namespace: View)
