# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api
  # Show action for generic API controllers.
  class Update < Cuprum::Rails::Actions::Update
    prepend Actions::Api::FindBySlug
    prepend Actions::Api::GenerateSlug
  end
end
