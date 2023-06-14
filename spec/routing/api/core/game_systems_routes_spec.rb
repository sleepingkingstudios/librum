# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/routing_contracts'

RSpec.describe "#{Api::Core::GameSystemsController} routes" do
  include Librum::Core::RSpec::Contracts::RoutingContracts

  include_contract 'should route to api resource', 'api/core/game_systems'
end
