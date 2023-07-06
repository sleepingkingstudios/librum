# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :authentication do
    resource :session, only: %i[create destroy]
    resource :user,    only: %i[show] do
      get 'password', to: 'users/passwords#edit'

      resource :password,
        controller: 'users/passwords',
        only:       %i[update]
    end
  end

  namespace :core do
    resources :publishers, only: %i[index show]
  end

  get '/', to: 'home#show'

  get '*path',
    to:          'home#not_found',
    constraints: { path: /(?!api).*/ }
end
