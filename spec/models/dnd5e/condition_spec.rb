# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Dnd5e::Condition, type: :model do
  include Librum::Tabletop::RSpec::Contracts::Models::ReferenceContracts

  subject(:reference) { described_class.new(attributes) }

  let(:attributes) do
    {
      name:        'Example Condition',
      slug:        'example-condition',
      stub:        false,
      description: <<~TEXT
        Just an example condition, nothing to worry about. Unless you experience
        any of the following symptoms:

        - Malaise
        - Confusion
        - Loss of Qualia*

        *Offer not valid for P-Zombies. Terms and conditions apply.
      TEXT
    }
  end

  include_contract 'should be a reference', type: 'Dnd5e::Condition'

  include_contract 'should define attribute',
    :description,
    default: ''

  include_contract 'should define attribute',
    :short_description,
    default: '',
    value:   'An example condition'

  describe '#valid?' do
    include_contract 'should validate the presence of',
      :description,
      type: String

    context 'when the reference is stubbed' do
      let(:attributes) { super().merge(stub: true) }

      describe 'should not validate the description' do
        let(:attributes) { super().merge(description: nil) }

        it { expect(reference).not_to have_errors.on(:description) }
      end
    end
  end
end
