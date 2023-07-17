# frozen_string_literal: true

require 'cuprum/collections/commands/upsert'
require 'cuprum/collections/loader'

module Loader::Middleware
  # Middleware for generating a password credential for a user.
  class GeneratePassword <
        Cuprum::Collections::Loader::Middleware::EntityMiddleware
    private

    def create_password_credential(action:, password:, user:)
      encrypted_password = step { encrypt_password(password) }
      attributes         = {
        active:     true,
        data:       { 'encrypted_password' => encrypted_password },
        expires_at: 100.years.from_now,
        type:       'Librum::Iam::PasswordCredential',
        user_id:    user.id
      }

      wrap_failure(action: action) { upsert_credential(attributes: attributes) }
    end

    def credentials_collection
      repository.find_or_create(record_class: Librum::Iam::Credential)
    end

    def encrypt_password(password)
      Librum::Iam::Authentication::Passwords::Generate.new.call(password)
    end

    def process(next_command, attributes:) # rubocop:disable Metrics/MethodLength
      if attributes['password'].blank?
        return super(next_command, attributes: attributes)
      end

      attributes   = attributes.dup
      password     = attributes.delete('password')
      action, user = step { super(next_command, attributes: attributes) }

      step do
        create_password_credential(
          action:   action,
          password: password,
          user:     user
        )
      end

      [action, user]
    end

    def upsert_credential(attributes:)
      Cuprum::Collections::Commands::Upsert
        .new(
          attribute_names: %i[user_id],
          collection:      credentials_collection
        )
        .call(attributes: attributes)
    end

    def wrap_failure(action:)
      result = yield

      return result if result.success?

      # :nocov:
      Cuprum::Result.new(
        error:  result.error,
        status: :failure,
        value:  [action, nil]
      )
      # :nocov:
    end
  end
end
