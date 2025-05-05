# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.3.8'

gem 'rails', '~> 7.0.8', '>= 7.0.8.7'

gem 'pg', '~> 1.5' # Use postgresql as the database for Active Record
gem 'puma', '~> 6.4', '>= 6.4.3' # Use the Puma web server

### Engines
gem 'librum-core',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/librum-core'
gem 'librum-iam',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/librum-iam'
gem 'librum-tabletop',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/librum-tabletop'

### Assets
gem 'importmap-rails' # Use JavaScript with ESM import maps
gem 'sprockets-rails' # The original asset pipeline for Rails

### Commands
gem 'cuprum', '~> 1.2'
gem 'cuprum-collections',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/cuprum-collections'
gem 'cuprum-collections-loader',
  branch:  'main',
  git:     'https://github.com/sleepingkingstudios/cuprum-collections-loader',
  require: false
gem 'cuprum-rails',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/cuprum-rails'
gem 'stannum', '~> 0.3'

### Views
gem 'view_component', '~> 3.0'

group :development, :test do
  gem 'byebug'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]

  # See https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md
  gem 'factory_bot_rails', '~> 6.2'

  gem 'rspec', '~> 3.10'
  gem 'rspec-rails', '~> 5.0'
  gem 'rspec-sleeping_king_studios', '~> 2.7'

  gem 'rubocop', '~> 1.71'
  gem 'rubocop-capybara', '~> 2.21'
  gem 'rubocop-factory_bot', '~> 2.26'
  gem 'rubocop-rails', '~> 2.29' # https://docs.rubocop.org/rubocop-rails/
  gem 'rubocop-rspec', '~> 3.4'  # https://docs.rubocop.org/rubocop-rspec/
  gem 'rubocop-rspec_rails', '~> 2.30'

  gem 'simplecov', '~> 0.21'
end

group :development do
  gem 'sleeping_king_studios-tasks', '~> 0.4', '>= 0.4.1'

  gem 'web-console' # Use console on exceptions pages
end
