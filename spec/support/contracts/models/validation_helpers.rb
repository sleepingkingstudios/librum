# frozen_string_literal: true

require 'support/contracts/models'

module Spec::Support::Contracts::Models
  module ValidationHelpers
    # :nocov:
    def extract_message(maybe_hash, default)
      return default unless maybe_hash.is_a?(Hash)

      maybe_hash.fetch(:message, default)
    end

    def normalize_attribute_type(value)
      return nil if value.nil?

      return value.name.underscore if value.is_a?(Class)

      value.to_s
    end
    # :nocov:
  end
end
