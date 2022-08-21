# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api::Admin::Authentication::Users
  # Show action for the Authentication::User API.
  class Update < Cuprum::Rails::Actions::Update
    prepend Actions::Api::FindBySlug
    prepend Actions::Api::GenerateSlug

    def slug_attributes
      :username
    end
  end
end
