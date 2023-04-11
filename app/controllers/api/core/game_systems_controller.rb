# frozen_string_literal: true

module Api::Core
  # API controller for managing GameSystem entities.
  class GameSystemsController < ApiController
    def self.resource
      ::Authentication::Resource.new(
        default_order:        %w[name edition],
        permitted_attributes: %w[
          publisher_id
          name
          slug
          edition
        ],
        resource_class:       ::GameSystem
      )
    end

    def self.serializers
      super().merge(
        ::GameSystem => Serializers::Json::GameSystemSerializer
      )
    end

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
