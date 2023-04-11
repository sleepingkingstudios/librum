# frozen_string_literal: true

module Api::Core::Sources
  # API controller for managing Sources::Website entities.
  class WebsitesController < ApiController
    def self.resource # rubocop:disable Metrics/MethodLength
      ::Authentication::Resource.new(
        default_order:        :name,
        permitted_attributes: %w[
          game_system_id
          publisher_id
          name
          slug
          edition
          official
          playtest
          base_url
        ],
        resource_class:       ::Sources::Website
      )
    end

    def self.serializers
      super().merge(
        ::Sources::Website => Serializers::Json::Sources::WebsiteSerializer
      )
    end

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
