# frozen_string_literal: true

# Basic controller for showing the Home page.
class HomeController < ViewController
  def self.resource
    ::Authentication::Resource.new(resource_name: 'home')
  end

  action :show, Actions::RenderView, member: false
end
