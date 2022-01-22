# frozen_string_literal: true

require 'cuprum/rails/actions/index'

module Api
  # API controller for managing Publisher entities.
  class PublishersController < ApiController
    def self.resource
      Cuprum::Rails::Resource.new(
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

    action :create,  Actions::Api::Publishers::Create
    action :destroy, Actions::Api::Publishers::Destroy, member: true
    action :index,   Cuprum::Rails::Actions::Index
    action :show,    Actions::Api::Publishers::Show,    member: true
    action :update,  Actions::Api::Publishers::Update,  member: true
  end
end
