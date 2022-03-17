# frozen_string_literal: true

module Api
  # API controller for managing authentication sessions.
  class SessionsController < ApiController
    # Responder class for authentication responses.
    class Responder < ApplicationResponder
      action :create do
        match :success do |result|
          render_success(result.value, status: 201)
        end
      end

      match :failure, error: ::Authentication::Errors::InvalidPassword \
      do |result|
        render_failure(result.error, status: 422)
      end
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
