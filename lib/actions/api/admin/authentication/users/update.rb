# frozen_string_literal: true

require 'librum/core/actions/update'

module Actions::Api::Admin::Authentication::Users
  # Show action for the Authentication::User API.
  class Update < Librum::Core::Actions::Update
    def slug_attributes
      :username
    end
  end
end
