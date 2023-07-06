# frozen_string_literal: true

require 'librum/iam/authentication/middleware/destroy_session'
require 'librum/iam/authentication/middleware/regenerate_session'

module Authentication
  # Controller for managing authentication sessions.
  class SessionsController < Librum::Iam::View::SessionsController
    middleware Librum::Iam::Authentication::Middleware::DestroySession,
      only: %i[destroy]

    middleware Librum::Iam::Authentication::Middleware::RegenerateSession,
      only: %i[create]
  end
end
