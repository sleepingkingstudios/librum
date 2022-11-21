# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api::GameSettings
  # Destroy action for the GameSetting API.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
