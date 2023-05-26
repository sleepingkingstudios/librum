# frozen_string_literal: true

require 'librum/core/actions/create'

module Actions::Api::Admin::Authentication::Users
  # Create action for the Authentication::User API.
  class Create < Librum::Core::Actions::Create
    def slug_attributes
      :username
    end
  end
end
