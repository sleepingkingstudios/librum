# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json
  # Serializes Settings as JSON.
  class GameSettingSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :publisher_id,
      :name,
      :slug
  end
end
