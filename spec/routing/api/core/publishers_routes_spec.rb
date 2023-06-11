# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/routing_contracts'

RSpec.describe "#{Api::Core::PublishersController} routes", type: :routing do
  include Librum::Core::RSpec::Contracts::RoutingContracts

  include_contract 'should route to api resource', 'api/core/publishers'
end
