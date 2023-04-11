# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Sources::Book, type: :model do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:book) { described_class.new(attributes) }

  let(:attributes) do
    {
      name: 'Example Book',
      slug: 'example-book',
      data: {
        'official'         => true,
        'playtest'         => true,
        'category'         => described_class::Categories::ADVENTURE,
        'publication_date' => '1982-07-09'
      }
    }
  end

  describe '::Categories' do
    let(:expected_categories) do
      {
        ADVENTURE:  'adventure',
        BESTIARY:   'bestiary',
        REFERENCE:  'reference',
        SETTING:    'setting',
        SOURCEBOOK: 'sourcebook'
      }
    end

    include_examples 'should define immutable constant', :Categories

    it 'should enumerate the categories' do
      expect(described_class::Categories.all).to be == expected_categories
    end

    describe '::ADVENTURE' do
      it 'should store the value' do
        expect(described_class::Categories::ADVENTURE).to be == 'adventure'
      end
    end

    describe '::BESTIARY' do
      it 'should store the value' do
        expect(described_class::Categories::BESTIARY).to be == 'bestiary'
      end
    end

    describe '::REFERENCE' do
      it 'should store the value' do
        expect(described_class::Categories::REFERENCE).to be == 'reference'
      end
    end

    describe '::SETTING' do
      it 'should store the value' do
        expect(described_class::Categories::SETTING).to be == 'setting'
      end
    end

    describe '::SOURCEBOOK' do
      it 'should store the value' do
        expect(described_class::Categories::SOURCEBOOK).to be == 'sourcebook'
      end
    end
  end

  include_contract 'should be a publication',
    type: 'Sources::Book'

  include_contract 'should define data property', :category

  include_contract 'should define data property', :publication_date

  describe '#homebrew?' do
    include_examples 'should define predicate', :homebrew?, false
  end

  describe '#valid?' do
    context 'when the book has category: ::SETTING' do
      let(:attributes) do
        data = super()[:data].merge(
          category: described_class::Categories::SETTING
        )

        super().merge(data: data)
      end

      include_contract 'should validate the presence of',
        :game_setting,
        message: 'must exist'

      context 'when the source has a game setting' do
        let(:game_setting) do
          FactoryBot.create(:game_setting, publisher: publisher)
        end
        let(:game_system) do
          FactoryBot.create(:game_system, publisher: publisher)
        end
        let(:publisher) { FactoryBot.create(:publisher) }
        let(:attributes) do
          super().merge(
            game_setting: game_setting,
            game_system:  game_system,
            publisher:    publisher
          )
        end

        it { expect(book.valid?).to be true }
      end
    end

    context 'when the source has a game system and a publisher' do
      let(:game_system) do
        FactoryBot.create(:game_system, publisher: publisher)
      end
      let(:publisher) { FactoryBot.create(:publisher) }
      let(:attributes) do
        super().merge(game_system: game_system, publisher: publisher)
      end

      it { expect(book.valid?).to be true }
    end

    include_contract 'should validate the inclusion of',
      :category,
      in:         described_class::Categories.values,
      attributes: lambda { |attributes|
        attributes[:data]['category'] = attributes.delete(:category)
        attributes
      },
      allow_nil:  true

    include_contract 'should validate the presence of',
      :category,
      attributes: lambda { |attributes|
        attributes[:data]['category'] = attributes.delete(:category)
        attributes
      },
      type:       String
  end
end
