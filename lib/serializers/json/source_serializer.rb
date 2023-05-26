# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json
  # Serializes Sources as JSON.
  class SourceSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :game_setting_id,
      :game_system_id,
      :publisher_id,
      :data,
      :name,
      :slug

    property(:homebrew, scope: :homebrew?, &:present?)
    property(:legacy,   scope: :legacy?,   &:present?)
    property(:official, scope: :official?, &:present?)
    property(:playtest, scope: :playtest?, &:present?)
  end
end
