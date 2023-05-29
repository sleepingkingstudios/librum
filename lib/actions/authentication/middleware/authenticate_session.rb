# frozen_string_literal: true

require 'cuprum/middleware'

module Actions::Authentication::Middleware
  # Middleware for authenticating the current user from the session.
  class AuthenticateSession < Cuprum::Command
    include Cuprum::Middleware

    # @param repository [Cuprum::Collections::Repository] The repository used to
    #   query the user and credential.
    # @param resource [Cuprum::Rails::Resource] The controller resource.
    def initialize(repository:, resource:)
      super()

      @repository = repository
      @resource   = resource
    end

    # @return [Cuprum::Collections::Repository] the repository used to query the
    #   user and credential.
    attr_reader :repository

    # @return [Cuprum::Rails::Resource] the controller resource.
    attr_reader :resource

    private

    def authenticate_request(request)
      Authentication::Strategies::SessionToken
        .new(repository: repository)
        .call(request.native_session)
    end

    def merge_result(result:, value:)
      Cuprum::Result.new(
        error:  result.error,
        status: result.status,
        value:  value
      )
    end

    def merge_value(session:, value:)
      return { '_session' => session } if value.nil?

      return value unless value.is_a?(Hash)

      value.merge('_session' => session)
    end

    def process(next_command, request:)
      return super if skip_authentication?(request)

      session = step { authenticate_request(request) }
      request =
        Authentication::Request.new(session: session, **request.properties)
      result  = next_command.call(request: request)
      value   = merge_value(session: session, value: result.value)

      merge_result(result: result, value: value)
    end

    def skip_authentication?(request)
      return false unless resource.is_a?(::Authentication::Resource)

      resource.skip_authentication_for?(request.action_name)
    end
  end
end