# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::GameSettings
  # Create action for the GameSetting API.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
