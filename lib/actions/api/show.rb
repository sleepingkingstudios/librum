# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api
  # Show action for generic API controllers.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::Api::FindBySlug
  end
end
