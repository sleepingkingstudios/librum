# frozen_string_literal: true

module Api::Core
  # API controller for managing Publisher entities.
  class PublishersController < ApiController
    def self.resource
      ::Authentication::Resource.new(
        default_order:        :name,
        permitted_attributes: %w[
          name
          slug
          website
        ],
        resource_class:       ::Publisher
      )
    end

    def self.serializers
      super().merge(
        ::Publisher => Serializers::Json::PublisherSerializer
      )
    end

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
