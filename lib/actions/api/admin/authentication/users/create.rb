# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::Admin::Authentication::Users
  # Create action for the Authentication::User API.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug

    def slug_attributes
      :username
    end
  end
end
