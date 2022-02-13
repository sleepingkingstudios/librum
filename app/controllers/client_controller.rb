# frozen_string_literal: true

# Controller for serving the front-end application.
class ClientController < ApplicationController
  def index
    render :index
  end
end
