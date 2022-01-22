# frozen_string_literal: true

require 'models'
require 'serializers'

loader = Rails.autoloaders.main

loader.push_dir(Rails.root.join('lib/models'), namespace: Models)
loader.push_dir(Rails.root.join('lib/serializers'), namespace: Serializers)
