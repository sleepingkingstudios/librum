# frozen_string_literal: true

require 'data'

module Data
  # Static configuration for loading record data.
  module Configuration
    # The core Librum record classes, required to load any system data.
    CORE_CLASSES = [
      ::Publisher,
      ::GameSystem,
      ::Sources::Book,
      ::Sources::Website
    ].freeze

    # @return [String] the default path to load data.
    def self.data_path
      Rails.root.join('data', Rails.env)
    end

    # Generates a repository that can be used to load record data.
    #
    # @param record_classes [Array<Class>] The record classes to add to the
    #   repository.
    def self.repository(*record_classes)
      repository = Cuprum::Rails::Repository.new

      CORE_CLASSES.each do |record_class|
        repository.find_or_create(record_class: record_class)
      end

      record_classes.each do |record_class|
        repository.find_or_create(record_class: record_class)
      end

      repository
    end
  end
end
