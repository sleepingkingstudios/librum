# frozen_string_literal: true

require 'set'

require 'librum/core/errors/authentication_error'
require 'librum/iam/view/pages/login_page'

module Responders::Authentication
  # Helper for responding to authentication failures.
  module Matching
    extend Utils::IncludeOnce

    class << self
      private

      def included_once(other)
        super

        match_authentication_error(other)
      end

      def match_authentication_error(matcher)
        matcher.match :failure,
          error: Librum::Core::Errors::AuthenticationError \
        do |result|
          render_component(
            Librum::Iam::View::Pages::LoginPage.new(result),
            layout: 'login',
            status: :unauthorized
          )
        end
      end
    end
  end
end
