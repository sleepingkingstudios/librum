# frozen_string_literal: true

require 'cuprum'

module Authentication::Errors
  # Error returned when a password does not match the encrypted value.
  class InvalidPassword < Cuprum::Error
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.invalid_password'

    # @param message [String] message describing the nature of the error.
    def initialize(message: nil, **options)
      super(
        message: message || default_message,
        **options
      )
    end

    private

    def default_message
      'password does not match encrypted value'
    end
  end
end
