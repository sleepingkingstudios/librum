# frozen_string_literal: true

require 'cuprum/rails/action'

module Actions::Api::Authentication::Sessions
  # Create action for Sessions API.
  class Create < Cuprum::Rails::Action
    private

    def build_token(session)
      Authentication::Jwt::Generate.new.call(session)
    end

    def find_credential
      Authentication::Passwords::Find
        .new(repository: repository)
        .call(username: params['username'], password: params['password'])
    end

    def process(request:)
      super

      credential = step { find_credential }
      session    = Authentication::Session.new(credential: credential)
      token      = step { build_token(session) }

      {
        'token' => token,
        'user'  => session.current_user
      }
    end
  end
end
