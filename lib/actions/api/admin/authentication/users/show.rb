# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api::Admin::Authentication::Users
  # Show action for the Authentication::User API.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::Api::FindBySlug
  end
end
