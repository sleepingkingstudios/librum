# frozen_string_literal: true

require 'cuprum/rails/actions/update'

module Actions::Api::GameSettings
  # Show action for the GameSetting API.
  class Update < Cuprum::Rails::Actions::Update
    prepend Actions::Api::FindBySlug
    prepend Actions::Api::GenerateSlug
  end
end
