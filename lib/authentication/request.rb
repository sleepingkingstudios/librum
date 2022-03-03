# frozen_string_literal: true

require 'forwardable'

require 'cuprum/rails/request'

module Authentication
  # A request wrapper with authenticaton session.
  class Request < Cuprum::Rails::Request
    extend Forwardable

    # @!attribute session
    #   @return [Authentication::Session] the current authentication session.
    property :session

    def_delegators :session,
      :current_user
  end
end
