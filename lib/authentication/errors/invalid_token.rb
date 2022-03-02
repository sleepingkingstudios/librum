# frozen_string_literal: true

require 'cuprum'

module Authentication::Errors
  # Abstract error returned for an invalid authentication token.
  class InvalidToken < Cuprum::Error
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.invalid_token'

    # @param message [String] Message describing the nature of the error.
    def initialize(message: nil, **options)
      super(
        message: message || default_message,
        **options
      )
    end

    private

    def default_message
      'invalid authentication token'
    end
  end
end
