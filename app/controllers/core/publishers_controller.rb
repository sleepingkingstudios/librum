# frozen_string_literal: true

require 'librum/core/actions/index'
require 'librum/core/resources/view_resource'

module Core
  # View controller for managing Publisher entities.
  class PublishersController < ViewController
    def self.resource
      Librum::Core::Resources::ViewResource.new(
        default_order:        :name,
        permitted_attributes: %w[
          name
          slug
          website
        ],
        resource_class:       ::Publisher,
        table_component:      View::Components::Core::Publishers::Table
      )
    end

    responder :html, Responders::Html::ResourceResponder

    action :index, Librum::Core::Actions::Index
  end
end
