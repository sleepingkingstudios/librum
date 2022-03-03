# frozen_string_literal: true

require 'errors'

module Errors
  # Generic returned for a request that fails authentication.
  class AuthenticationFailed < Cuprum::Error
    # Short string used to identify the type of error.
    TYPE = 'errors.authentication_failed'

    def initialize
      super(message: 'Unable to authenticate request')
    end
  end
end
