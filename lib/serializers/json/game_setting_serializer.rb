# frozen_string_literal: true

module Serializers::Json
  # Serializes Settings as JSON.
  class GameSettingSerializer < RecordSerializer
    attributes \
      :publisher_id,
      :name,
      :slug
  end
end
