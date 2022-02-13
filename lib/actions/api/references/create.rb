# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::References
  # Create action for Reference APIs.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
