# frozen_string_literal: true

require 'cuprum/rails/controller'

require 'librum/core/responders/html/view_responder'

# Abstract base class for HTML controllers.
class ViewController < ApplicationController
  include Cuprum::Rails::Controller

  def self.repository
    return @repository if @repository

    @repository = Cuprum::Rails::Repository.new
  end

  default_format :html

  responder :html, Librum::Core::Responders::Html::ViewResponder

  middleware Actions::Authentication::Middleware::AuthenticateSession

  layout 'page'
end
