# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api::GameSystems
  # Destroy action for the GameSystem API.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
