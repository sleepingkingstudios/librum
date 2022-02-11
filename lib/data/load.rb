# frozen_string_literal: true

require 'cuprum/collections/loader'
require 'cuprum/command'

module Data
  # Loads data for the specified classes in the given order.
  class Load < Cuprum::Command
    # @param data_path [String] The root url of the data files.
    # @param record_classes [Array<Class>] The record classes to add to the
    #   repository.
    def initialize(record_classes:, data_path: nil)
      super()

      @data_path      = data_path || Data::Configuration.data_path
      @record_classes = record_classes
      @repository     =
        Data::Configuration.repository(*record_classes)
    end

    # @return [String] the root url of the data files.
    attr_reader :data_path

    # @return [Array<Class>] the record classes to add to the repository.
    attr_reader :record_classes

    # @return [Cuprum::Rails::Repository] the repository used to load and query
    #   record data.
    attr_reader :repository

    private

    def collection_for(record_class)
      repository[qualified_name_for(record_class)]
    end

    def load_command
      @load_command ||=
        Cuprum::Collections::Loader::Load
        .new(data_path: data_path, repository: repository)
        .tap { |command| command.add_observer(observer) }
    end

    def observer
      Cuprum::Collections::Loader::Observer.new
    end

    def process
      record_classes.each.with_object(load_command) do |record_class, command|
        command.call(collection: collection_for(record_class))
      end
    end

    def qualified_name_for(record_class)
      record_class
        .name
        .split('::')
        .map(&:underscore)
        .join('/')
        .pluralize
    end
  end
end
