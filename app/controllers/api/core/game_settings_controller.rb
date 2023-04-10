# frozen_string_literal: true

require 'cuprum/rails/actions/index'

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

    action :create,  Actions::Api::GameSettings::Create
    action :destroy, Actions::Api::GameSettings::Destroy, member: true
    action :index,   Cuprum::Rails::Actions::Index
    action :show,    Actions::Api::GameSettings::Show,    member: true
    action :update,  Actions::Api::GameSettings::Update,  member: true
  end
end
