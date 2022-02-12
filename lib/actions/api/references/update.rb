# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api::References
  # Update action for Reference APIs.
  class Update < Cuprum::Rails::Actions::Update
    prepend Actions::Api::FindBySlug
    prepend Actions::Api::GenerateSlug
  end
end
