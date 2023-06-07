# frozen_string_literal: true

require 'view'

module View::Components
  # Abstract base class for view page components.
  class Page < ViewComponent::Base
    # @param result [Cuprum::Result] the result of calling the controller
    #   action.
    def initialize(result)
      super()

      @result   = result
      @error    = result.error
      @status   = result.status
      @value    = result.value
      @metadata = result.respond_to?(:metadata) ? result.metadata : nil
    end

    # @return [Cuprum::Result] the result error.
    attr_reader :error

    # @return [Hash{Symbol=>Object}] the result metadata.
    attr_reader :metadata

    # @return [Cuprum::Result] the result of calling the controller action.
    attr_reader :result

    # @return [:success, :failure] the result status.
    attr_reader :status

    # @return [Object] the result value.
    attr_reader :value
  end
end
