# frozen_string_literal: true

module Api::Dnd5e
  # API controller for managing Dnd5e::Condition entities.
  class ConditionsController < ApiController
    def self.resource # rubocop:disable Metrics/MethodLength
      ::Authentication::Resource.new(
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

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
