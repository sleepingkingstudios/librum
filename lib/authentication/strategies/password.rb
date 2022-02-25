# frozen_string_literal: true

require 'cuprum'
require 'cuprum/collections/commands/find_one_matching'

module Authentication::Strategies
  # Finds the password credential for the requested user and matches passwords.
  class Password < Cuprum::Command
    # @param repository [Cuprum::Collections::Repository] The repository used to
    #   query the user and credential.
    def initialize(repository:)
      super()

      @repository = repository
    end

    attr_reader :repository

    private

    attr_reader :request

    def credentials_collection
      repository['authentication/credentials']
    end

    def find_credential(user)
      Cuprum::Collections::Commands::FindOneMatching
        .new(collection: credentials_collection)
        .call(
          attributes: {
            active:  true,
            type:    'Authentication::PasswordCredential',
            user_id: user.id
          }
        )
    end

    def find_user
      Cuprum::Collections::Commands::FindOneMatching
        .new(collection: users_collection)
        .call(attributes: { username: username })
    end

    def password
      request.params['password']
    end

    def process(request)
      @request = request

      steps do
        step { require_parameters }

        user       = step { find_user }
        credential = step { find_credential(user) }

        step { validate_credential(credential) }

        return Authorization::Session.new(credential: credential)
      end

      failure(Authentication::Errors::InvalidPassword.new)
    end

    def require_parameters
      return if username.present? && password.present?

      failure(Cuprum::Error.new(message: 'missing username or password'))
    end

    def users_collection
      repository['authentication/users']
    end

    def username
      request.params['username']
    end

    def validate_credential(credential)
      step { validate_expiration(credential) }

      step { validate_password(credential) }
    end

    def validate_expiration(credential)
      return unless credential.expired?

      failure(Cuprum::Error.new(message: 'expired credential'))
    end

    def validate_password(credential)
      Authentication::Passwords::Match
        .new(credential.encrypted_password)
        .call(password)
    end
  end
end
