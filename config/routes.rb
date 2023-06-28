# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  namespace :authentication do
    resource :session,
      controller: '/librum/iam/view/sessions',
      only:       %i[create destroy]
  end

  namespace :core do
    resources :publishers, only: %i[index show]
  end

  get '/', to: 'home#show'

  get '*path',
    to:          'home#not_found',
    constraints: { path: /(?!api).*/ }
end
