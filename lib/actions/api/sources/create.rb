# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::Sources
  # Create action for Source APIs.
  class Create < Cuprum::Rails::Actions::Create
    prepend Actions::Api::GenerateSlug
  end
end
