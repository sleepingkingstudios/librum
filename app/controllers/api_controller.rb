# frozen_string_literal: true

require 'cuprum/rails/controller'
require 'cuprum/rails/responders/json/resource'

# Abstract base class for API controllers.
class ApiController < ApplicationController
  include Cuprum::Rails::Controller

  protect_from_forgery with: :null_session

  def self.repository
    return @repository if @repository

    @repository = Cuprum::Rails::Repository.new

    @repository.find_or_create(record_class: ::Authentication::Credential)
    @repository.find_or_create(record_class: ::Authentication::User)

    @repository
  end

  def self.serializers
    Serializers::Json.default_serializers
  end

  default_format :json

  middleware Actions::Api::Middleware::Authenticate

  responder :json, ApplicationResponder
end
