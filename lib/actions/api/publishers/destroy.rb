# frozen_string_literal: true

require 'cuprum/rails/actions/destroy'

module Actions::Api::Publishers
  # Destroy action for the Publisher API.
  class Destroy < Cuprum::Rails::Actions::Destroy
    prepend Actions::Api::FindBySlug
  end
end
