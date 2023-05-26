# frozen_string_literal: true

require 'librum/core/actions/create'
require 'librum/core/actions/destroy'
require 'librum/core/actions/index'
require 'librum/core/actions/show'
require 'librum/core/actions/update'

module Api::Core::Sources
  # API controller for managing Sources::Book entities.
  class BooksController < Librum::Core::ApiController
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
          publication_date
        ],
        resource_class:       ::Sources::Book
      )
    end

    def self.serializers
      super().merge(
        ::Sources::Book => Serializers::Json::Sources::BookSerializer
      )
    end

    action :create,  Librum::Core::Actions::Create
    action :destroy, Librum::Core::Actions::Destroy, member: true
    action :index,   Librum::Core::Actions::Index
    action :show,    Librum::Core::Actions::Show,    member: true
    action :update,  Librum::Core::Actions::Update,  member: true
  end
end
