# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json
  # Serializes References as JSON.
  class ReferenceSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :source_id,
      :source_metadata,
      :name,
      :slug,
      :stub
  end
end
