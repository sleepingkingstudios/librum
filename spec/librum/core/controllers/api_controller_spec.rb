# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Librum::Core::ApiController do # rubocop:disable RSpec/FilePath
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.middleware' do
    include_contract 'should define middleware',
      Actions::Authentication::Middleware::AuthenticateRequest
  end
end
