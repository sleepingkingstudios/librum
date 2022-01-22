# frozen_string_literal: true

module Serializers::Json
  # Serializes Publishers as JSON.
  class PublisherSerializer < RecordSerializer
    attributes \
      :name,
      :slug,
      :website
  end
end
