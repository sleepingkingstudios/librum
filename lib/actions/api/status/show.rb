# frozen_string_literal: true

require 'cuprum/rails/action'

module Actions::Api::Status
  # Show action for the status API.
  class Show < Cuprum::Rails::Action
    private

    def process(request:)
      super

      {}
    end
  end
end
