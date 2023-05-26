# frozen_string_literal: true

require 'librum/core/actions/create'
require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'
require 'librum/core/actions/update'

module Api::Core
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

    action :create,  Librum::Core::Actions::Create
    action :destroy, Librum::Core::Actions::Destroy, member: true
    action :index,   Librum::Core::Actions::Index
    action :show,    Librum::Core::Actions::Show,    member: true
    action :update,  Librum::Core::Actions::Update,  member: true
  end
end
