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

  layout 'page'

  responder :html, Responders::HtmlResponder
end
