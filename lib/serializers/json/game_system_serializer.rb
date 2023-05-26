# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json
  # Serializes Game Systems as JSON.
  class GameSystemSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :publisher_id,
      :name,
      :slug,
      :edition
  end
end
