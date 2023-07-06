# frozen_string_literal: true

require 'librum/core/actions/view/middleware/page_breadcrumbs'
require 'librum/core/actions/view/middleware/page_navigation'
require 'librum/iam/authentication/middleware/regenerate_session'

module Authentication::Users
  # Controller for managing the current user's password.
  class PasswordsController < Librum::Iam::View::Users::PasswordsController
    # Responder class for user password responses.
    class Responder < Librum::Core::Responders::Html::ResourceResponder
      action :update do
        match :success do
          message = 'Successfully changed password'

          redirect_to(
            '/authentication/user',
            flash: {
              success: { icon: 'circle-check', message: message }
            }
          )
        end

        match :failure do |result|
          message = 'Unable to change password'

          render_component(
            result,
            action: :edit,
            flash:  {
              warning: { icon: 'exclamation-triangle', message: message }
            },
            status: :unprocessable_entity
          )
        end
      end
    end

    def self.breadcrumbs # rubocop:disable Metrics/MethodLength
      @breadcrumbs ||= [
        {
          label: 'Home',
          url:   '/'
        },
        {
          label: 'User',
          url:   '/authentication/user'
        },
        {
          active: true,
          label:  'Password',
          url:    '/authentication/user/password'
        }
      ]
    end

    responder :html, Authentication::Users::PasswordsController::Responder

    middleware Librum::Core::Actions::View::Middleware::PageNavigation.new(
      navigation: CoreController.navigation
    )

    middleware Librum::Core::Actions::View::Middleware::PageBreadcrumbs.new(
      breadcrumbs: breadcrumbs,
      resource:    resource
    )

    middleware Librum::Iam::Authentication::Middleware::RegenerateSession,
      only: %i[update]
  end
end
