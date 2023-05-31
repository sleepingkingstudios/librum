# frozen_string_literal: true

module Authentication
  # Controller for managing authentication sessions.
  class SessionsController < ViewController
    # Responder class for authentication responses.
    class Responder < Responders::HtmlResponder
      action :create do
        match :success do
          redirect_back
        end

        match :failure, error: ::Authentication::Errors::InvalidLogin \
        do |result|
          alert = {
            icon:    'user-xmark',
            message: 'Invalid username or password.'
          }

          render_component(
            View::Pages::LoginPage.new(result),
            flash:  { danger: alert },
            layout: 'login',
            status: :unprocessable_entity
          )
        end
      end

      action :destroy do
        match :success do
          alert = {
            icon:    'user-xmark',
            message: 'You have successfully logged out.'
          }

          redirect_to(
            '/',
            flash: { warning: alert }
          )
        end
      end
    end

    def self.resource
      ::Authentication::Resource.new(
        resource_name:       'sessions',
        skip_authentication: %i[create destroy]
      )
    end

    responder :html, Authentication::SessionsController::Responder

    action :create,  Actions::Authentication::Sessions::Create

    action :destroy, Actions::Authentication::Sessions::Destroy
  end
end
