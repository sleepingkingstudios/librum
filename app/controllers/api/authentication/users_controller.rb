# frozen_string_literal: true

require 'cuprum/rails/actions/index'

module Api::Authentication
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

    action :create,  Actions::Api::Authentication::Users::Create
    action :destroy, Actions::Api::Authentication::Users::Destroy, member: true
    action :index,   Cuprum::Rails::Actions::Index
    action :show,    Actions::Api::Authentication::Users::Show,    member: true
    action :update,  Actions::Api::Authentication::Users::Update,  member: true
  end
end
