# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Loader::Configuration do
  describe '::AUTHENTICATION_CLASSES' do
    let(:expected) do
      [
        Librum::Iam::User
      ]
    end

    include_examples 'should define constant',
      :AUTHENTICATION_CLASSES,
      -> { be == expected }
  end

  describe '::CORE_CLASSES' do
    let(:expected) do
      [
        Publisher,
        GameSetting,
        GameSystem,
        Sources::Book,
        Sources::Website
      ]
    end

    include_examples 'should define constant',
      :CORE_CLASSES,
      -> { be == expected }
  end

  describe '::DND5E_CLASSES' do
    let(:expected) do
      [
        Dnd5e::Condition
      ]
    end

    include_examples 'should define constant',
      :DND5E_CLASSES,
      -> { be == expected }
  end

  describe '.data_path' do
    let(:expected) { Rails.root.join('data', Rails.env) }

    include_examples 'should define class reader',
      :data_path,
      -> { be == expected }

    context 'when the Rails environment is set' do
      before(:example) do
        allow(Rails).to receive(:env).and_return('postproduction')
      end

      it { expect(described_class.data_path).to be == expected }
    end
  end

  describe '.repository' do
    let(:expected_classes) do
      [
        Source,
        *described_class::CORE_CLASSES
      ]
    end
    let(:expected_keys) do
      expected_classes.map do |record_class|
        record_class.name.split('::').map(&:underscore).join('/').pluralize
      end
    end

    it 'should define the class method' do
      expect(described_class)
        .to respond_to(:repository)
        .with_unlimited_arguments
    end

    it { expect(described_class.repository).to be_a Cuprum::Rails::Repository }

    it 'should define the collections' do
      expect(described_class.repository.keys).to match_array(expected_keys)
    end

    describe 'with many record classes' do
      let(:record_classes) do
        [
          Spec::Gadget,
          Spec::Widget,
          Spec::TradeGoods::SelfSealingStemBolt
        ]
      end
      let(:expected_classes) { super() + record_classes }

      example_class 'Spec::Gadget', ApplicationRecord
      example_class 'Spec::Widget', ApplicationRecord
      example_class 'Spec::TradeGoods::SelfSealingStemBolt', ApplicationRecord

      it 'should define the collections' do
        expect(described_class.repository(*record_classes).keys)
          .to match_array(expected_keys)
      end
    end
  end
end
