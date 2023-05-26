# frozen_string_literal: true

require 'librum/core/responders/json_responder'

module Api::Authentication
  # API controller for managing authentication sessions.
  class SessionsController < Librum::Core::ApiController
    # Responder class for authentication responses.
    class Responder < Librum::Core::Responders::JsonResponder
      action :create do
        match :success do |result|
          render_success(result.value, status: 201)
        end
      end

      match :failure, error: ::Authentication::Errors::InvalidLogin \
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

    responder :json, Api::Authentication::SessionsController::Responder

    action :create, Actions::Api::Authentication::Sessions::Create
  end
end
