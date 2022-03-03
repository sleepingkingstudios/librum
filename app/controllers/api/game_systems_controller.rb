# frozen_string_literal: true

require 'cuprum/rails/actions/index'

module Api
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

    action :create,  Actions::Api::GameSystems::Create
    action :destroy, Actions::Api::GameSystems::Destroy, member: true
    action :index,   Cuprum::Rails::Actions::Index
    action :show,    Actions::Api::GameSystems::Show,    member: true
    action :update,  Actions::Api::GameSystems::Update,  member: true
  end
end
