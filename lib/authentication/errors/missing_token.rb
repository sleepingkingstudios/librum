# frozen_string_literal: true

require 'cuprum'

module Authentication::Errors
  # Error returned when an authentication token is not provided.
  class MissingToken < Cuprum::Error
    # Short string used to identify the type of error.
    TYPE = 'authentication.errors.missing_token'

    def initialize
      super(message: 'missing authentication token')
    end
  end
end
