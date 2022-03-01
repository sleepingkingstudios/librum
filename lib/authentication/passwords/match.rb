# frozen_string_literal: true

require 'bcrypt'
require 'cuprum'

module Authentication::Passwords
  # Matches the given value against an encrypted password.
  class Match < Cuprum::Command
    # @param encrypted_password [String] The encrypted password to match.
    def initialize(encrypted_password)
      super()

      @encrypted_password = encrypted_password
    end

    # @return [String] the encrypted password to match.
    attr_reader :encrypted_password

    private

    def password
      BCrypt::Password.new(encrypted_password)
    end

    def process(value)
      return if password == value

      failure(Authentication::Errors::InvalidPassword.new)
    end
  end
end
