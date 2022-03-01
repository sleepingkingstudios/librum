# frozen_string_literal: true

module Serializers::Json::Authentication
  # Serializes Authentication::Users as JSON.
  class UserSerializer < Serializers::Json::RecordSerializer
    attributes \
      :email,
      :role,
      :slug,
      :username
  end
end
