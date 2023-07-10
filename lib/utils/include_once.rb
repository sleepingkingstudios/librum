# frozen_string_literal: true

require 'set'

module Utils
  # Utility module for executing code the first time a module is included.
  module IncludeOnce
    # Module for tracking idempotently-included modules.
    module IdempotentModules
      # @return [Set] the names of the included modules.
      def idempotent_modules
        @idempotent_modules ||= Set.new([])
      end
    end

    private

    def included(other)
      super

      other.extend(IdempotentModules)

      return if other.idempotent_modules.include?(name)

      other.idempotent_modules << name

      included_once(other)
    end

    def included_once(*); end
  end
end
