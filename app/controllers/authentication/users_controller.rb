# frozen_string_literal: true

require 'librum/core/actions/view/middleware/page_navigation'
require 'librum/core/actions/view/middleware/resource_breadcrumbs'

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
      navigation: CoreController.navigation
    )

    middleware Librum::Core::Actions::View::Middleware::ResourceBreadcrumbs.new(
      breadcrumbs: breadcrumbs,
      resource:    resource
    )
  end
end
