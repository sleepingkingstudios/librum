# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/credential_contracts'

RSpec.describe Authentication::Credential, type: :model do
  include Spec::Support::Contracts::Models::CredentialContracts

  subject(:source) { described_class.new(attributes) }

  let(:attributes) do
    {
      active:     true,
      data:       {
        'key' => 'value'
      },
      expires_at: 1.year.from_now
    }
  end

  include_contract 'should be a credential', type: nil

  describe '#valid?' do
    include_contract 'should validate the presence of', :type, type: String
  end
end
