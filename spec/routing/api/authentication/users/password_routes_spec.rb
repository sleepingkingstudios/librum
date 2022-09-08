# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/routing_contracts'

RSpec.describe "#{Api::Authentication::Users::PasswordsController} routes",
  type: :routing \
do
  include Spec::Support::Contracts::RoutingContracts

  include_contract 'should route to api resource',
    'authentication/user/password',
    controller: 'api/authentication/users/passwords',
    only:       %i[update],
    singular:   true
end
