# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::Publishers
  # Create action for the Publisher API.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
