# frozen_string_literal: true

module View::Components::Authentication
  # Renders the current authentication session.
  class CurrentSession < ViewComponent::Base
    extend Forwardable

    # @param session [Authentication::Session] the current session.
    def initialize(session:)
      super()

      @session = session
    end

    def_delegators :@session,
      :current_user

    # @return [Authentication::Session] the current session.
    attr_reader :session
  end
end
