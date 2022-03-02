# frozen_string_literal: true

module Authentication::Errors
  # Abstract error returned for an expired authentication token.
  class ExpiredToken < Authentication::Errors::InvalidToken
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.expired_token'

    private

    def default_message
      'expired authentication token'
    end
  end
end
