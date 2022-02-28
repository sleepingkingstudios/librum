# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/routing_contracts'

RSpec.describe "#{Api::SessionsController} routes", type: :routing do
  include Spec::Support::Contracts::RoutingContracts

  include_contract 'should route to api resource',
    'session',
    only:     %i[create],
    singular: true
end
