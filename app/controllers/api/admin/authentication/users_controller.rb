# frozen_string_literal: true

module Api::Admin::Authentication
  # API controller for managing Authentication::User entities.
  class UsersController < ApiController
    def self.resource
      ::Authentication::Resource.new(
        default_order:        :username,
        permitted_attributes: %w[
          email
          role
          slug
          username
        ],
        resource_class:       ::Authentication::User
      )
    end

    def self.serializers
      user_serializer = Serializers::Json::Authentication::UserSerializer

      super().merge(
        ::Authentication::User => user_serializer
      )
    end

    action :create,
      Actions::Api::Admin::Authentication::Users::Create
    action :destroy,
      Actions::Api::Destroy,
      member: true
    action :index,
      Actions::Api::Index
    action :show,
      Actions::Api::Show,
      member: true
    action :update,
      Actions::Api::Admin::Authentication::Users::Update,
      member: true
  end
end
