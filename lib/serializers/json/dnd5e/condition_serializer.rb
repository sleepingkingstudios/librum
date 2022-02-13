# frozen_string_literal: true

module Serializers::Json::Dnd5e
  # Serializes Dnd5e::Conditions as JSON.
  class ConditionSerializer < Serializers::Json::ReferenceSerializer
    attributes \
      :description,
      :short_description
  end
end
