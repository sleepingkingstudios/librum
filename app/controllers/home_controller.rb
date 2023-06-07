# frozen_string_literal: true

# Basic controller for showing the Home page.
class HomeController < ViewController
  def self.resource
    Librum::Core::Resources::BaseResource.new(resource_name: 'home')
  end

  action :not_found, Actions::RenderView, member: false

  action :show,      Actions::RenderView, member: false
end
