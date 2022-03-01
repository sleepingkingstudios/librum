# frozen_string_literal: true

require 'actions'
require 'authentication'
require 'data'
require 'models'
require 'serializers'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/actions'), namespace: Actions)
loader.push_dir(
  Rails.root.join('lib/authentication'),
  namespace: Authentication
)
loader.push_dir(Rails.root.join('lib/data'), namespace: Data)
loader.push_dir(Rails.root.join('lib/models'), namespace: Models)
loader.push_dir(Rails.root.join('lib/serializers'), namespace: Serializers)
