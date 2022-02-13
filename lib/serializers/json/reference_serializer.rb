# frozen_string_literal: true

module Serializers::Json
  # Serializes References as JSON.
  class ReferenceSerializer < RecordSerializer
    attributes \
      :source_id,
      :source_metadata,
      :name,
      :slug,
      :stub
  end
end
