# frozen_string_literal: true

module View::Layouts
  # Default layout for server-side rendered pages.
  class Page < ViewComponent::Base
    # @param alerts [Hash{String=>String}] the alerts to display.
    # @param breadcrumbs
    #   [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>,
    #   false] the breadcrumbs to render, or false if the page should not render
    #   breadcrumbs. Defaults to false.
    # @param current_user [Authentication::User, nil] the current authenticated
    #   user.
    # @param navigation [View::Layouts::Page::Navigation::Configuration, false]
    #   the configured navigation, or false if the navigation bar is hidden.
    def initialize(
      alerts:       nil,
      breadcrumbs:  false,
      current_user: nil,
      navigation:   false,
      **
    )
      super()

      @alerts       = alerts
      @breadcrumbs  = breadcrumbs
      @current_user = current_user
      @navigation   = navigation
    end

    # @return [Hash{String=>String}] the alerts to display.
    attr_reader :alerts

    # @return [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>,
    #   false] the breadcrumbs to render, or false if the page should not render
    #   breadcrumbs.
    attr_reader :breadcrumbs

    # @return [Authentication::User, nil] the current authenticated user.
    attr_reader :current_user

    # @return [View::Layouts::Page::Navigation::Configuration, false] the
    #   configured navigation, or false if the navigation bar is hidden.
    attr_reader :navigation
  end
end
