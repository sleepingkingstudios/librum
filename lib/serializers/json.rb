# frozen_string_literal: true

require 'cuprum/rails'

module Serializers
  # Namespace for JSON serializers and configuration.
  module Json
    # Default serializers for handling value objects and data structures.
    #
    # @return [Hash<Class, Cuprum::Rails::Serializers::Json::Serializer>] the
    #   default serializers.
    def self.default_serializers
      date_time_serializer = Serializers::Json::DateTimeSerializer.instance

      @default_serializers ||=
        Cuprum::Rails::Serializers::Json
        .default_serializers
        .merge(
          ActiveSupport::TimeWithZone => date_time_serializer,
          Date                        => date_time_serializer,
          DateTime                    => date_time_serializer,
          Time                        => date_time_serializer
        )
    end
  end
end
