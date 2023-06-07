# frozen_string_literal: true

module Api::Authentication
  # API controller for managing Authentication::User entities.
  class UsersController < Librum::Core::ApiController
    def self.resource
      Librum::Core::Resources::BaseResource.new(
        resource_class: ::Authentication::User
      )
    end

    def self.serializers
      user_serializer = Serializers::Json::Authentication::UserSerializer

      super().merge(
        ::Authentication::User => user_serializer
      )
    end

    action :show,
      Actions::Api::Authentication::Users::Show,
      member: true
  end
end
