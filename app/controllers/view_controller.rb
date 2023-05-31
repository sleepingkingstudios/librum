# frozen_string_literal: true

require 'cuprum/rails/controller'

# Abstract base class for HTML controllers.
class ViewController < ApplicationController
  include Cuprum::Rails::Controller

  def self.repository
    return @repository if @repository

    @repository = Cuprum::Rails::Repository.new
  end

  default_format :html

  responder :html, Responders::HtmlResponder

  middleware Actions::Authentication::Middleware::AuthenticateSession

  layout 'page'
end
