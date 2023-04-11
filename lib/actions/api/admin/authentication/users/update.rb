# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api::Admin::Authentication::Users
  # Show action for the Authentication::User API.
  class Update < Actions::Api::Update
    def slug_attributes
      :username
    end
  end
end
