# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.2.2'

gem 'rails', '~> 7.0.4'

gem 'pg', '~> 1.5' # Use postgresql as the database for Active Record
gem 'puma', '~> 6.0' # Use the Puma web server
gem 'rack-cors', '~> 2.0'

### Engines
gem 'librum-core',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/librum-core'
gem 'librum-iam',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/librum-iam'

### Assets
gem 'importmap-rails' # Use JavaScript with ESM import maps
gem 'sprockets-rails' # The original asset pipeline for Rails

### Data
gem 'bcrypt', '~> 3.1.18'
gem 'jwt',    '~> 2.7'

### Commands
gem 'cuprum',
  branch: 'main',
  git:    'https://github.com/sleepingkingstudios/cuprum'
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
  gem 'annotate',
    group: :development,
    git:   'https://github.com/sleepingkingstudios/annotate_models'

  gem 'byebug'

  gem 'capybara', '~> 3.39'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]

  # See https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md
  gem 'factory_bot_rails', '~> 6.2'

  gem 'rspec', '~> 3.10'
  gem 'rspec-rails', '~> 5.0'
  gem 'rspec-sleeping_king_studios', '~> 2.7'

  gem 'rubocop', '~> 1.49'
  gem 'rubocop-rails', '~> 2.19' # https://docs.rubocop.org/rubocop-rails/
  gem 'rubocop-rake', '~> 0.6'
  gem 'rubocop-rspec', '~> 2.19' # https://docs.rubocop.org/rubocop-rspec/

  gem 'simplecov', '~> 0.21'
end

group :development do
  gem 'sleeping_king_studios-tasks', '~> 0.4', '>= 0.4.1'

  gem 'web-console' # Use console on exceptions pages
end
