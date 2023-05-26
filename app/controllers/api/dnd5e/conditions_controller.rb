# frozen_string_literal: true

require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'

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

    # rubocop:disable Layout/ExtraSpacing
    action :create,  Actions::Api::References::Create
    action :destroy, Librum::Core::Actions::Destroy,             member: true
    action :index,   Librum::Core::Actions::Index
    action :show,    Librum::Core::Actions::Show,       member: true
    action :update,  Actions::Api::References::Update,  member: true
    # rubocop:enable Layout/ExtraSpacing
  end
end
