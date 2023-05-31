# frozen_string_literal: true

Librum::Core::Engine.instance_exec do
  config.after_initialize do
    Librum::Core::ApiController.middleware(
      Actions::Authentication::Middleware::AuthenticateRequest
    )
  end
end
