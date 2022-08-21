# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api::Admin::Authentication::Users
  # Destroy action for the Authentication::User API.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
