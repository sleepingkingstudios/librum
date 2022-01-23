# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api::Sources
  # Update action for Source APIs.
  class Update < Cuprum::Rails::Actions::Update
    prepend Actions::Api::FindBySlug
    prepend Actions::Api::GenerateSlug
  end
end
