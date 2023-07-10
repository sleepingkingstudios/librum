# frozen_string_literal: true

require 'librum/core/resources/base_resource'
require 'librum/core/responders/html/view_responder'

Librum::Core::Engine.instance_exec do
  config.to_prepare do
    # Add authentication config to all controller resources.
    Librum::Core::Resources::BaseResource.include(Librum::Iam::Resource)

    # Authenticate View requests.
    Librum::Core::ViewController.include(Authentication::SessionMiddleware)

    # Render the login page after an authentication failure.
    Librum::Core::Responders::Html::ViewResponder
      .include(Responders::Authentication::Matching)
  end
end
