# frozen_string_literal: true

require 'cuprum/rails/actions/show'

module Actions::Api::Sources
  # Show action for Source APIs.
  class Show < Cuprum::Rails::Actions::Show
    prepend Actions::Api::FindBySlug
  end
end
