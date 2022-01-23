# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Source, type: :model do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:source) { described_class.new(attributes) }

  let(:attributes) do
    {
      name:      'Example Source',
      slug:      'example-source',
      shortcode: 'es',
      data:      {
        'official' => true,
        'playtest' => true
      }
    }
  end

  describe '.data_property' do
    let(:described_class) { Spec::ExampleSource }

    example_class 'Spec::ExampleSource', described_class

    it 'should define the class method' do
      expect(described_class)
        .to respond_to(:data_property)
        .with(1).argument
        .and_keywords(:predicate)
    end

    describe 'with a property name' do
      let(:property_name) { :prop_name }

      before(:example) { described_class.data_property(property_name) }

      include_contract 'should define data property', :prop_name
    end

    describe 'with a property name and predicate: true' do
      let(:property_name) { :prop_name }

      before(:example) do
        described_class.data_property(property_name, predicate: true)
      end

      include_contract 'should define data property',
        :prop_name,
        predicate: true
    end
  end

  include_contract 'should be a source', type: nil

  describe '#homebrew?' do
    include_examples 'should define predicate', :homebrew?, false
  end

  describe '#valid?' do
    include_contract 'should validate the presence of', :type, type: String
  end
end
