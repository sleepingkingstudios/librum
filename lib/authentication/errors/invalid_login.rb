# frozen_string_literal: true

require 'librum/core/errors/authentication_error'

module Authentication::Errors
  # Error returned for a failed username+password login.
  class InvalidLogin < Librum::Core::Errors::AuthenticationError
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.invalid_login'

    def initialize
      super(message: 'invalid username or password')
    end
  end
end
