# frozen_string_literal: true

require 'cuprum/rails/controller'
require 'cuprum/rails/responders/json/resource'

# Abstract base class for API controllers.
class ApiController < ApplicationController
  include Cuprum::Rails::Controller

  default_format :json

  protect_from_forgery with: :null_session

  responder :json, Cuprum::Rails::Responders::Json::Resource

  def self.serializers
    Serializers::Json.default_serializers
  end
end
