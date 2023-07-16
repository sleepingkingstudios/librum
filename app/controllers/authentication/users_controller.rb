# frozen_string_literal: true

module Authentication
  # Controller for managing the current user.
  class UsersController < Librum::Iam::View::UsersController
    def self.breadcrumbs
      @breadcrumbs ||= [
        {
          label: 'Home',
          url:   '/'
        },
        {
          label: 'User',
          url:   '/authentication/user'
        }
      ]
    end

    middleware Librum::Core::Actions::View::Middleware::PageNavigation.new(
      navigation: Librum::Tabletop::Engine.config.page_navigation
    )

    middleware Librum::Core::Actions::View::Middleware::ResourceBreadcrumbs.new(
      breadcrumbs: breadcrumbs,
      resource:    resource
    )
  end
end
