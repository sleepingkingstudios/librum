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
      data: {}
    }
  end

  include_contract 'should be a source', type: nil

  describe '#homebrew?' do
    it { expect(source.homebrew?).to be false }
  end

  describe '#legacy?' do
    it { expect(source.legacy?).to be false }
  end

  describe '#official?' do
    it { expect(source.official?).to be false }
  end

  describe '#playtest?' do
    it { expect(source.playtest?).to be false }
  end

  describe '#valid?' do
    let(:errors) { source.tap(&:valid?).errors }

    it { expect(source.valid?).to be false }

    it { expect(errors.details.keys).to be == %i[type] }

    include_contract 'should validate the presence of', :type, type: String
  end
end
