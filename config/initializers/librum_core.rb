# frozen_string_literal: true

require 'librum/core/resources/base_resource'

Librum::Core::Engine.instance_exec do
  config.after_initialize do
    Librum::Core::ApiController.middleware(
      Actions::Authentication::Middleware::AuthenticateRequest
    )

    Librum::Core::Resources::BaseResource.include(Authentication::Resource)
  end
end
