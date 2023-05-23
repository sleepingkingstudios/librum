# frozen_string_literal: true

require 'actions'
require 'authentication'
require 'errors'
require 'loader'
require 'models'
require 'responders'
require 'responses'
require 'serializers'
require 'view'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/actions'), namespace: Actions)
loader.push_dir(
  Rails.root.join('lib/authentication'),
  namespace: Authentication
)
loader.push_dir(Rails.root.join('lib/errors'), namespace: Errors)
loader.push_dir(Rails.root.join('lib/loader'), namespace: Loader)
loader.push_dir(Rails.root.join('lib/models'), namespace: Models)
loader.push_dir(Rails.root.join('lib/responders'), namespace: Responders)
loader.push_dir(Rails.root.join('lib/responses'), namespace: Responses)
loader.push_dir(Rails.root.join('lib/serializers'), namespace: Serializers)
loader.push_dir(Rails.root.join('lib/view'), namespace: View)
