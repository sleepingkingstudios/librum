# frozen_string_literal: true

module Api
  # API controller providing a status check endpoint.
  class StatusController < Librum::Core::ApiController
    def self.resource
      ::Authentication::Resource.new(
        resource_name:       'status',
        singular:            true,
        skip_authentication: true
      )
    end

    action :show, Actions::Api::Status::Show, member: true
  end
end
