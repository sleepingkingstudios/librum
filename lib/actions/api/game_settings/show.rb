# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api::GameSettings
  # Show action for the GameSetting API.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::Api::FindBySlug
  end
end
