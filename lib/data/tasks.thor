# frozen_string_literal: true

module Data
  # Namespace for Thor tasks that load serialized data.
  class Tasks < ::Thor
    namespace :data

    desc 'load', 'Loads serialized data from the directory'
    option :'data-path',
      type:     :string,
      required: false,
      desc:     'The path to the serialized data'
    def load
      lazy_require_rails!

      Data::Load
        .new(data_path: options['data-path'], record_classes: scoped_classes)
        .call
    end

    private

    def lazy_require_rails!
      require_relative '../../config/environment'
    end

    def scoped_classes
      Data::Configuration::CORE_CLASSES
    end
  end
end
