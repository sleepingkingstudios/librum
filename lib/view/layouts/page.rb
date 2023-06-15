# frozen_string_literal: true

module View::Layouts
  # Default layout for server-side rendered pages.
  class Page < ViewComponent::Base
    # @param alerts [Hash{String=>String}] the alerts to display.
    # @param current_user [Authentication::User, nil] the current authenticated
    #   user.
    # @param navigation [Hash, false] the configured navigation, or false if
    #   the navigation bar is hidden.
    def initialize(
      alerts:       nil,
      current_user: nil,
      navigation:   false,
      **
    )
      super()

      @alerts       = alerts
      @current_user = current_user
      @navigation   = navigation
    end

    # @return [Hash{String=>String}] the alerts to display.
    attr_reader :alerts

    # @return [Authentication::User, nil] the current authenticated user.
    attr_reader :current_user

    # @return [Array, false] the configured navigation, or false if the
    #   navigation bar is hidden.
    attr_reader :navigation
  end
end
