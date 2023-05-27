# frozen_string_literal: true

module Authentication::Strategies
  # Authentication strategy for parsing an encoded JWT from a session.
  class SessionToken < Authentication::Strategies::Token
    class << self
      def matches?(session)
        session.key?('auth_token')
      end
      alias match? matches?
    end

    private

    attr_reader :session

    def find_token
      session['auth_token']
    end

    def process(session)
      @session = session

      super
    end
  end
end
