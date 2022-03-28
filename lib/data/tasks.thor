# frozen_string_literal: true

module Data
  # Namespace for Thor tasks that load serialized data.
  class Tasks < ::Thor
    namespace :data

    desc 'load', 'Loads serialized data from the directory'
    option :authentication,
      type:     :boolean,
      required: false,
      desc:     'Load authentication data'
    option :'data-path',
      type:     :string,
      required: true,
      desc:     'The path to the serialized data'
    def load
      lazy_require_rails!

      record_classes = scoped_classes(
        authentication: options['authentication']
      )

      Data::Load
        .new(
          data_path:      options['data-path'],
          record_classes: record_classes
        )
        .call
    end

    private

    def lazy_require_rails!
      require_relative '../../config/environment'
    end

    def scoped_classes(authentication:)
      record_classes = Data::Configuration::CORE_CLASSES

      if authentication
        raise if Rails.env.production?

        record_classes += Data::Configuration::AUTHENTICATION_CLASSES
      end

      record_classes
    end
  end
end
