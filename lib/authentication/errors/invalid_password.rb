# frozen_string_literal: true

require 'cuprum'

module Authentication::Errors
  # Error returned for a failed username+password login.
  class InvalidPassword < Cuprum::Error
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.invalid_password'

    def initialize
      super(message: 'invalid username or password')
    end
  end
end
