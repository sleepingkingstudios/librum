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
    option :core,
      type:     :boolean,
      required: false,
      default:  true,
      desc:     'Load core data, such as game systems and publishers'
    option :'data-path',
      type:     :string,
      required: true,
      desc:     'The path to the serialized data'
    option :dnd5e,
      type:     :boolean,
      required: false,
      desc:     'Load data for D&D Fifth Edition'
    def load # rubocop:disable Metrics/MethodLength
      lazy_require_rails!

      record_classes = scoped_classes(
        authentication: options['authentication'],
        core:           options['core'],
        dnd5e:          options['dnd5e']
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

    def scoped_classes(authentication:, core:, dnd5e:)
      record_classes = core ? Data::Configuration::CORE_CLASSES : []

      if authentication
        raise if Rails.env.production?

        record_classes += Data::Configuration::AUTHENTICATION_CLASSES
      end

      record_classes += Data::Configuration::DND5E_CLASSES if dnd5e

      record_classes
    end
  end
end
