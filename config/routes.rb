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
    api_resources :game_systems

    api_resources :publishers
  end
end
