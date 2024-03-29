# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_view/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Librum
  # The Rails application for Librum.
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join('extras')

    # Don't generate system test files.
    config.generators.system_tests = nil

    # Configure autoload paths.
    config.autoload_paths << "#{root}/lib"
    config.autoload_paths << "#{Librum::Core::Engine.root}/lib"
    config.autoload_paths << "#{Librum::Iam::Engine.root}/lib"
    config.autoload_paths << "#{Librum::Tabletop::Engine.root}/lib"
  end
end
