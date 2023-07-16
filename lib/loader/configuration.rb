# frozen_string_literal: true

module Loader
  # Static configuration for loading record data.
  module Configuration
    # The authentication record classes, for loading user fixtures.
    AUTHENTICATION_CLASSES = [
      Librum::Iam::User
    ].freeze

    # The core Librum record classes, required to load any system data.
    CORE_CLASSES = [
      Librum::Tabletop::Publisher,
      Librum::Tabletop::GameSetting,
      Librum::Tabletop::GameSystem,
      Librum::Tabletop::Sources::Book,
      Librum::Tabletop::Sources::Website
    ].freeze

    # The reference classes defined for D&D Fifth Edition.
    DND5E_CLASSES = [
      ::Dnd5e::Condition
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

      repository.find_or_create(record_class: Librum::Tabletop::Source)

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
