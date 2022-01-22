# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api::GameSystems
  # Show action for the GameSystem API.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::Api::FindBySlug
  end
end
