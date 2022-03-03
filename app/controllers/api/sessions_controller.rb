# frozen_string_literal: true

module Api
  # API controller for managing authentication sessions.
  class SessionsController < ApiController
    # Responder class for authentication responses.
    class Responder < ApplicationResponder
      match :failure, error: ::Authentication::Errors::InvalidPassword \
      do |result|
        render_failure(result.error, status: 422)
      end
    end

    def self.repository
      return @repository if @repository

      @repository = Cuprum::Rails::Repository.new

      @repository.find_or_create(record_class: ::Authentication::Credential)
      @repository.find_or_create(record_class: ::Authentication::User)

      @repository
    end

    def self.resource
      ::Authentication::Resource.new(
        resource_name:       'sessions',
        skip_authentication: :create
      )
    end

    def self.serializers
      user_serializer =
        Serializers::Json::Authentication::UserSerializer

      super().merge(::Authentication::User => user_serializer)
    end

    responder :json, Api::SessionsController::Responder

    action :create, Actions::Api::Sessions::Create
  end
end
