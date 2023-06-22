# frozen_string_literal: true

require 'librum/core/resources/base_resource'
require 'librum/core/responders/html/view_responder'
require 'librum/core/view/layouts/page'

Librum::Core::Engine.instance_exec do
  config.after_initialize do
    # Authenticate API requests.
    Librum::Core::ApiController.middleware(
      Actions::Authentication::Middleware::AuthenticateRequest
    )

    # Authenticate View requests.
    Librum::Core::ViewController.middleware(
      Actions::Authentication::Middleware::AuthenticateSession
    )

    # Add authentication config to all controller resources.
    Librum::Core::Resources::BaseResource.include(Authentication::Resource)

    # Render the login page after an authentication failure.
    Librum::Core::Responders::Html::ViewResponder.match :failure,
      error: Librum::Core::Errors::AuthenticationError \
    do |result|
      render_component(
        View::Pages::LoginPage.new(result),
        layout: 'login',
        status: :unauthorized
      )
    end
  end
end
