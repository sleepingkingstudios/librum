# frozen_string_literal: true

require 'librum/core/resources/base_resource'
require 'librum/core/responders/html/view_responder'
require 'librum/iam/authentication/middleware/authenticate_session'
require 'librum/iam/resource'
require 'librum/iam/view/pages/login_page'

Librum::Core::Engine.instance_exec do
  config.after_initialize do
    # Authenticate View requests.
    Librum::Core::ViewController.middleware(
      Librum::Iam::Authentication::Middleware::AuthenticateSession
    )

    # Add authentication config to all controller resources.
    Librum::Core::Resources::BaseResource.include(Librum::Iam::Resource)

    # Render the login page after an authentication failure.
    Librum::Core::Responders::Html::ViewResponder.match :failure,
      error: Librum::Core::Errors::AuthenticationError \
    do |result|
      render_component(
        Librum::Iam::View::Pages::LoginPage.new(result),
        layout: 'login',
        status: :unauthorized
      )
    end
  end
end
