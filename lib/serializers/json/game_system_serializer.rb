# frozen_string_literal: true

module Serializers::Json
  # Serializes Game Systems as JSON.
  class GameSystemSerializer < RecordSerializer
    attributes \
      :publisher_id,
      :name,
      :slug,
      :edition
  end
end
