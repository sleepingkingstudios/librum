# frozen_string_literal: true

module Authentication::Errors
  # Abstract error returned for an malformed authentication token.
  class MalformedToken < Authentication::Errors::InvalidToken
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.malformed_token'

    private

    def default_message
      'malformed authentication token'
    end
  end
end
