# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  class << self
    API_ROUTES = %i[index create show update destroy].freeze

    def api_resources(resource_name, **options, &block)
      resources(
        resource_name,
        options.reverse_merge(
          format: :json,
          only:   API_ROUTES
        ),
        &block
      )
    end
  end

  namespace :api do
    namespace :authentication do
      api_resources :users
    end

    namespace :dnd5e do
      api_resources :conditions
    end

    api_resources :game_systems

    api_resources :publishers

    namespace :sources do
      api_resources :books

      api_resources :websites
    end
  end

  get '*path',
    to:          'client#index',
    constraints: { path: /(?!api).*/ }

  root 'client#index'
end
