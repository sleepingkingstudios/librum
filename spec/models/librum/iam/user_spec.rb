# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/model_contracts'

RSpec.describe Librum::Iam::User, type: :model do
  include Librum::Core::RSpec::Contracts::ModelContracts

  subject(:user) { described_class.new(attributes) }

  let(:attributes) do
    {
      email:    'alan.bradley@example.com',
      username: 'Alan Bradley',
      slug:     'alan-bradley',
      role:     described_class::Roles::USER
    }
  end

  ## Associations
  include_contract 'should have one',
    :homebrew_source,
    factory_name: :homebrew
end
