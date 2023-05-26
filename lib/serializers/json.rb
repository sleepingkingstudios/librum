# frozen_string_literal: true

require 'cuprum/rails'

require 'librum/core/serializers/json'

module Serializers
  # Namespace for JSON serializers and configuration.
  module Json
    # Default serializers for handling value objects and data structures.
    #
    # @return [Hash<Class, Cuprum::Rails::Serializers::Json::Serializer>] the
    #   default serializers.
    def self.default_serializers
      Librum::Core::Serializers::Json.default_serializers
    end
  end
end
