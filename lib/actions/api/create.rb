# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api
  # Create action for generic API controllers.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
