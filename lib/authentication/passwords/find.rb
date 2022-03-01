# frozen_string_literal: true

require 'cuprum'
require 'cuprum/collections/commands/find_one_matching'

module Authentication::Passwords
  # Finds the password credential for the requested user and matches passwords.
  class Find < Cuprum::Command
    # @param repository [Cuprum::Collections::Repository] The repository used to
    #   query the user and credential.
    def initialize(repository:)
      super()

      @repository = repository
    end

    attr_reader :repository

    private

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

    def find_user(username)
      Cuprum::Collections::Commands::FindOneMatching
        .new(collection: users_collection)
        .call(attributes: { username: username })
    end

    def process(password:, username:)
      steps do
        user       = step { find_user(username) }
        credential = step { find_credential(user) }

        step { validate_credential(credential: credential, password: password) }

        return credential
      end

      failure(Authentication::Errors::InvalidPassword.new)
    end

    def users_collection
      repository['authentication/users']
    end

    def validate_credential(credential:, password:)
      step { validate_expiration(credential) }

      Authentication::Passwords::Match
        .new(credential.encrypted_password)
        .call(password)
    end

    def validate_expiration(credential)
      return unless credential.expired?

      failure(Cuprum::Error.new(message: 'expired credential'))
    end
  end
end
