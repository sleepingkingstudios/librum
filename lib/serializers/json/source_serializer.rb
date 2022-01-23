# frozen_string_literal: true

module Serializers::Json
  # Serializes Sources as JSON.
  class SourceSerializer < RecordSerializer
    attributes \
      :game_system_id,
      :publisher_id,
      :data,
      :name,
      :slug
  end
end
