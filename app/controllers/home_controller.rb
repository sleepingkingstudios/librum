# frozen_string_literal: true

# Basic controller for showing the Home page.
class HomeController < ViewController
  def self.breadcrumbs
    @breadcrumbs ||= [{ label: 'Home', url: '/' }]
  end

  def self.resource
    Librum::Core::Resources::BaseResource.new(resource_name: 'home')
  end

  middleware Actions::View::Middleware::PageBreadcrumbs.new(
    breadcrumbs: breadcrumbs
  )

  middleware Actions::View::Middleware::PageNavigation.new(
    navigation: CoreController.navigation
  )

  action :not_found, Actions::RenderView, member: false

  action :show,      Actions::RenderView, member: false
end
