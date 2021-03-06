# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/routing_contracts'

RSpec.describe "#{Api::GameSystemsController} routes" do
  include Spec::Support::Contracts::RoutingContracts

  include_contract 'should route to api resource', 'game_systems'
end
