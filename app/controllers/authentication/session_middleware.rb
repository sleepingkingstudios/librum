# frozen_string_literal: true

require 'librum/iam/authentication/middleware/authenticate_session'

module Authentication
  # Helper for defining authentication middleware.
  module SessionMiddleware
    extend Utils::IncludeOnce

    class << self
      private

      def included_once(other)
        super

        other.instance_exec do
          middleware(
            Librum::Iam::Authentication::Middleware::AuthenticateSession
          )
        end
      end
    end
  end
end
