# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.0.3'

gem 'rails', '~> 7.0.1'

gem 'pg', '~> 1.1' # Use postgresql as the database for Active Record
gem 'puma', '~> 5.0' # Use the Puma web server

### Assets
gem 'importmap-rails' # Use JavaScript with ESM import maps
gem 'sprockets-rails' # The original asset pipeline for Rails

### Data
gem 'annotate',
  group: :development,
  git:   'https://github.com/sleepingkingstudios/annotate_models'
gem 'bcrypt', '~> 3.1.7'

group :development, :test do
  gem 'byebug'

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]

  # See https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md
  gem 'factory_bot_rails', '~> 6.2'

  gem 'rspec', '~> 3.10'
  gem 'rspec-rails', '~> 5.0'
  gem 'rspec-sleeping_king_studios', '~> 2.7'

  gem 'rubocop', '~> 1.25'
  gem 'rubocop-rails', '~> 2.13' # https://docs.rubocop.org/rubocop-rails/
  gem 'rubocop-rake', '~> 0.6'
  gem 'rubocop-rspec', '~> 2.7' # https://docs.rubocop.org/rubocop-rspec/

  gem 'simplecov', '~> 0.21'
end

group :development do
  gem 'sleeping_king_studios-tasks', '~> 0.4', '>= 0.4.1'

  gem 'web-console' # Use console on exceptions pages
end
