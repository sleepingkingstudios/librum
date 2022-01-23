# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api::Sources
  # Destroy action for Source APIs.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
