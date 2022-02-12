# frozen_string_literal: true

require 'cuprum/rails/actions/index'

module Api::Dnd5e
  # API controller for managing Dnd5e::Condition entities.
  class ConditionsController < ApiController
    def self.resource # rubocop:disable Metrics/MethodLength
      Cuprum::Rails::Resource.new(
        default_order:        :name,
        permitted_attributes: %w[
          source_id
          source_metadata
          name
          slug
          stub
          short_description
          description
        ],
        resource_class:       ::Dnd5e::Condition
      )
    end

    def self.serializers
      super().merge(
        ::Dnd5e::Condition => Serializers::Json::Dnd5e::ConditionSerializer
      )
    end

    action :create,  Actions::Api::References::Create
    action :destroy, Actions::Api::References::Destroy, member: true
    action :index,   Cuprum::Rails::Actions::Index
    action :show,    Actions::Api::References::Show,    member: true
    action :update,  Actions::Api::References::Update,  member: true
  end
end
