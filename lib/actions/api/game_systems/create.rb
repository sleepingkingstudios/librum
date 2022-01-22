# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::GameSystems
  # Create action for the GameSystem API.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
