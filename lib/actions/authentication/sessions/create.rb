# frozen_string_literal: true

require 'cuprum/rails/action'

module Actions::Authentication::Sessions
  # Action for creating an authentication session.
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

    def native_session
      request.native_session
    end

    def process(request:)
      super

      credential = step { find_credential }
      session    = Authentication::Session.new(credential: credential)
      token      = step { build_token(session) }

      write_session(token)

      {}
    end

    def write_session(token)
      native_session['auth_token'] = token
    end
  end
end
