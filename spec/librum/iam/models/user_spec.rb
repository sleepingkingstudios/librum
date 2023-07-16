# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Librum::Iam::User, type: :model do # rubocop:disable RSpec/FilePath
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
