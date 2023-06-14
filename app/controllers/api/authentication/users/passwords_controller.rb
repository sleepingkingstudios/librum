# frozen_string_literal: true

module Api::Authentication::Users
  # API controller for managing Authentication::PasswordCredential.
  class PasswordsController < Librum::Core::ApiController
    def self.resource
      Librum::Core::Resources::BaseResource.new(
        resource_class: ::Authentication::Credential,
        singular:       true
      )
    end

    action :update,
      Actions::Api::Authentication::Users::Passwords::Update,
      member: true
  end
end
