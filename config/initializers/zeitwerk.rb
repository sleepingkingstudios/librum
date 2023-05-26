# frozen_string_literal: true

require 'actions'
require 'authentication'
require 'loader'
require 'responders'
require 'serializers'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/actions'), namespace: Actions)
loader.push_dir(
  Rails.root.join('lib/authentication'),
  namespace: Authentication
)
loader.push_dir(Rails.root.join('lib/loader'), namespace: Loader)
loader.push_dir(Rails.root.join('lib/responders'), namespace: Responders)
loader.push_dir(Rails.root.join('lib/serializers'), namespace: Serializers)
