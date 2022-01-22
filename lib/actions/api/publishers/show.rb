# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api::Publishers
  # Show action for the Publisher API.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::FindBySlug
  end
end
