# frozen_string_literal: true

module Actions::Api::Admin::Authentication::Users
  # Create action for the Authentication::User API.
  class Create < Actions::Api::Create
    def slug_attributes
      :username
    end
  end
end
