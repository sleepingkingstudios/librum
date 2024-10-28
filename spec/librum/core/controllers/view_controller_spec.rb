# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Librum::Core::ViewController do # rubocop:disable RSpec/SpecFilePathFormat
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.middleware' do
    include_contract 'should define middleware',
      Librum::Iam::Authentication::Middleware::AuthenticateSession
  end
end
