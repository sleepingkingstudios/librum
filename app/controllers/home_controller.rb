# frozen_string_literal: true

# Basic controller for showing the Home page.
class HomeController < Librum::Core::ViewController
  def self.breadcrumbs
    @breadcrumbs ||= [{ active: true, label: 'Home', url: '/' }]
  end

  def self.resource
    @resource ||=
      Librum::Core::Resources::BaseResource.new(resource_name: 'home')
  end

  middleware Librum::Core::Actions::View::Middleware::PageBreadcrumbs.new(
    breadcrumbs: breadcrumbs
  )

  middleware Librum::Core::Actions::View::Middleware::PageNavigation.new(
    navigation: Librum::Tabletop::Engine.config.page_navigation
  )

  action :not_found, Librum::Core::Actions::View::RenderPage, member: false

  action :show,      Librum::Core::Actions::View::RenderPage, member: false
end
