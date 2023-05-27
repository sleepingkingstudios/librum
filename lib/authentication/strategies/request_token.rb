# frozen_string_literal: true

module Authentication::Strategies
  # Authentication strategy for parsing an encoded JWT from a request.
  class RequestToken < Authentication::Strategies::Token
    class << self
      def matches?(request)
        header_token?(request) || params_token?(request)
      end
      alias match? matches?

      private

      def header_token?(request)
        request.authorization.present? &&
          request.authorization.start_with?('Bearer')
      end

      def params_token?(request)
        request.params.key?('token')
      end
    end

    private

    attr_reader :request

    def find_token
      header_token || params_token
    end

    def header_token
      return nil unless header_token?

      _, token = request.authorization.split

      token
    end

    def header_token?
      request.authorization.present? &&
        request.authorization.start_with?('Bearer')
    end

    def process(request)
      @request = request

      super
    end

    def params_token
      request.params['token']
    end
  end
end
