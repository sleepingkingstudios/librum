# frozen_string_literal: true

module Api::Core::Sources
  # API controller for managing Sources::Book entities.
  class BooksController < ApiController
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

    action :create,  Actions::Api::Create
    action :destroy, Actions::Api::Destroy, member: true
    action :index,   Actions::Api::Index
    action :show,    Actions::Api::Show,    member: true
    action :update,  Actions::Api::Update,  member: true
  end
end
