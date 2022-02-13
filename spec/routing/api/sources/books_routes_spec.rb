# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/routing_contracts'

RSpec.describe "#{Api::Sources::BooksController} routes", type: :routing do
  include Spec::Support::Contracts::RoutingContracts

  include_contract 'should route to api resource', 'sources/books'
end
