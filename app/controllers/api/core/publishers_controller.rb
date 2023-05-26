# frozen_string_literal: true

require 'librum/core/actions/create'
require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'
require 'librum/core/actions/update'

module Api::Core
  # API controller for managing Publisher entities.
  class PublishersController < Librum::Core::ApiController
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

    action :create,  Librum::Core::Actions::Create
    action :destroy, Librum::Core::Actions::Destroy, member: true
    action :index,   Librum::Core::Actions::Index
    action :show,    Librum::Core::Actions::Show,    member: true
    action :update,  Librum::Core::Actions::Update,  member: true
  end
end
