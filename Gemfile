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
gem 'bcrypt', '~> 3.1.7'

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  gem 'web-console' # Use console on exceptions pages
end
