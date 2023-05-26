# frozen_string_literal: true

require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'

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
      Librum::Core::Actions::Destroy,
      member: true
    action :index,
      Librum::Core::Actions::Index
    action :show,
      Librum::Core::Actions::Show,
      member: true
    action :update,
      Actions::Api::Admin::Authentication::Users::Update,
      member: true
  end
end
