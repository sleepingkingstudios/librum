# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Source, type: :model do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:source) { described_class.new(attributes) }

  let(:attributes) do
    {
      name: 'Example Source',
      slug: 'example-source',
      data: {
        'official' => true,
        'playtest' => true
      }
    }
  end

  include_contract 'should be a source', type: nil

  describe '#homebrew?' do
    include_examples 'should define predicate', :homebrew?, false
  end

  describe '#valid?' do
    include_contract 'should validate the presence of', :type, type: String
  end
end
