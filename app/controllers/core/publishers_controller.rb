# frozen_string_literal: true

require 'librum/core/actions/index'
require 'librum/core/actions/show'
require 'librum/core/actions/view/middleware/resource_breadcrumbs'
require 'librum/core/resources/view_resource'
require 'librum/core/responders/html/resource_responder'

module Core
  # View controller for managing Publisher entities.
  class PublishersController < CoreController
    def self.breadcrumbs
      @breadcrumbs ||= [
        {
          label: 'Home',
          url:   '/'
        },
        {
          label: 'Publishers',
          url:   '/core/publishers'
        }
      ]
    end

    def self.resource # rubocop:disable Metrics/MethodLength
      Librum::Core::Resources::ViewResource.new(
        base_path:            '/core/publishers',
        default_order:        :name,
        permitted_attributes: %w[
          name
          slug
          website
        ],
        resource_class:       ::Publisher,
        block_component:      View::Components::Core::Publishers::Block,
        table_component:      View::Components::Core::Publishers::Table
      )
    end

    middleware Librum::Core::Actions::View::Middleware::ResourceBreadcrumbs.new(
      breadcrumbs: breadcrumbs,
      resource:    resource
    )

    responder :html, Librum::Core::Responders::Html::ResourceResponder

    action :index, Librum::Core::Actions::Index

    action :show,  Librum::Core::Actions::Show, member: true
  end
end
