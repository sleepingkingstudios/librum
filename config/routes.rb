# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  class << self
    API_ROUTES = %i[index create show update destroy].freeze

    def api_resource(resource_name, **options, &block)
      resource(
        resource_name,
        **options.reverse_merge(
          format: :json,
          only:   API_ROUTES[1..]
        ),
        &block
      )
    end

    def api_resources(resource_name, **options, &block)
      resources(
        resource_name,
        **options.reverse_merge(
          format: :json,
          only:   API_ROUTES
        ),
        &block
      )
    end
  end

  namespace :api do
    namespace :admin do
      namespace :authentication do
        api_resources :users
      end
    end

    namespace :authentication do
      api_resource :session, only: :create

      api_resource :user, only: :show do
        api_resource :password,
          controller: 'users/passwords',
          only:       :update
      end
    end

    namespace :dnd5e do
      api_resources :conditions
    end

    api_resources :game_settings

    api_resources :game_systems

    api_resources :publishers

    namespace :sources do
      api_resources :books

      api_resources :websites
    end

    api_resource :status,
      controller: 'status',
      only:       :show
  end

  get '*path',
    to:          'client#index',
    constraints: { path: /(?!api).*/ }

  root 'client#index'
end
