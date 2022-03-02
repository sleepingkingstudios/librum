# frozen_string_literal: true

require 'cuprum'

module Authentication::Strategies
  # Authentication strategy for parsing an encoded JWT.
  class Token < Cuprum::Command
    class << self
      def matches?(request)
        header_token?(request) || params_token?(request)
      end
      alias match? matches?

      def token(request)
        header_token(request) || params_token(request)
      end

      private

      def header_token(request)
        return nil unless header_token?(request)

        _, token = request.authorization.split

        token
      end

      def header_token?(request)
        request.authorization.present? &&
          request.authorization.start_with?('Bearer')
      end

      def params_token(request)
        request.params['token']
      end

      def params_token?(request)
        request.params.key?('token')
      end
    end

    # @param repository [Cuprum::Collections::Repository] The repository used to
    #   query the credential.
    def initialize(repository:)
      super()

      @repository = repository
    end

    # @return [Cuprum::Collections::Repository] the repository used to query the
    #   credential.
    attr_reader :repository

    private

    attr_reader :request

    def build_session(credential:, payload:)
      expires_at = Time.zone.at(payload['expires_at'])

      Authentication::Session.new(
        credential: credential,
        expires_at: expires_at
      )
    end

    def credentials_collection
      repository['authentication/credentials']
    end

    def find_credential(credential_id:)
      result = credentials_collection.find_one.call(primary_key: credential_id)

      return result.value if result.success?

      failure(
        Authentication::Errors::MissingCredential
          .new(credential_id: credential_id)
      )
    end

    def parse_token(token)
      Authentication::Jwt::Parse.new.call(token)
    end

    def process(request)
      @request = request

      token      = step { require_token }
      payload    = step { parse_token(token) }

      step { validate_token(payload) }

      credential = step do
        find_credential(credential_id: payload['credential_id'])
      end

      step { validate_credential(credential) }

      build_session(credential: credential, payload: payload)
    end

    def require_token
      token = self.class.token(request)

      return token if token.present?

      failure(Authentication::Errors::MissingToken.new)
    end

    def validate_credential(credential)
      return unless credential.expired?

      failure(
        Authentication::Errors::ExpiredCredential
          .new(credential_id: credential.id)
      )
    end

    def valid_token?(payload)
      return false unless payload['credential_id'].is_a?(String)

      return false unless payload['expires_at'].is_a?(Integer)

      true
    end

    def validate_token(payload)
      return if valid_token?(payload)

      failure(Authentication::Errors::InvalidToken.new)
    end
  end
end
