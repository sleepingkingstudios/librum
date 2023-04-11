# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api
  # Destroy action for generic API controllers.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
