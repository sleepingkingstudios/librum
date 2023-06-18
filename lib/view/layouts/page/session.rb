# frozen_string_literal: true

module View::Layouts
  # Component for rendering the current session.
  class Page::Session < ViewComponent::Base
    # @param current_user [Authentication::User, nil] the current authenticated
    #   user.
    def initialize(current_user:)
      super()

      @current_user = current_user
    end

    # @return [Authentication::User] the current authenticated user.
    attr_reader :current_user
  end
end
