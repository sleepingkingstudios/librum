# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json
  # Serializes Publishers as JSON.
  class PublisherSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :name,
      :slug,
      :website
  end
end
