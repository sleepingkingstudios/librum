# frozen_string_literal: true

require 'cuprum'
require 'jwt'

module Authentication::Jwt
  # Generates a session from an encoded JWT.
  class Parse < Cuprum::Command
    private

    def decode_token(token)
      payload, = JWT.decode(token, secret, true, algorithm: 'HS512')

      payload
    rescue JWT::ExpiredSignature
      failure(Authentication::Errors::ExpiredToken.new)
    rescue JWT::IncorrectAlgorithm
      failure(Authentication::Errors::InvalidToken.new)
    rescue JWT::DecodeError
      failure(Authentication::Errors::MalformedToken.new)
    end

    def process(token)
      step { validate_token(token) }

      payload = step { decode_token(token) }

      {
        'credential_id' => payload['sub'],
        'expires_at'    => payload['exp']
      }
    end

    def secret
      Rails.application.secret_key_base
    end

    def validate_token(token)
      return if token.is_a?(String) && !token.empty?

      failure(Authentication::Errors::MalformedToken.new)
    end
  end
end
