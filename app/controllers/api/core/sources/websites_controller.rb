# frozen_string_literal: true

require 'librum/core/actions/create'
require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'
require 'librum/core/actions/update'

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

    action :create,  Librum::Core::Actions::Create
    action :destroy, Librum::Core::Actions::Destroy, member: true
    action :index,   Librum::Core::Actions::Index
    action :show,    Librum::Core::Actions::Show,    member: true
    action :update,  Librum::Core::Actions::Update,  member: true
  end
end
