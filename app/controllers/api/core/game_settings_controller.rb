# frozen_string_literal: true

module Api::Core
  # API controller for managing GameSetting entities.
  class GameSettingsController < ApiController
    def self.resource
      ::Authentication::Resource.new(
        default_order:        :name,
        permitted_attributes: %w[
          name
          publisher_id
          slug
        ],
        resource_class:       ::GameSetting
      )
    end

    def self.serializers
      super().merge(
        ::GameSetting => Serializers::Json::GameSettingSerializer
      )
    end

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
