# frozen_string_literal: true

require 'librum/core/serializers/json/record_serializer'

module Serializers::Json::Authentication
  # Serializes Authentication::Users as JSON.
  class UserSerializer <
        Librum::Core::Serializers::Json::RecordSerializer
    attributes \
      :email,
      :role,
      :slug,
      :username
  end
end
