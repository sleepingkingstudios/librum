# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Sources::Book, type: :model do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:book) { described_class.new(attributes) }

  let(:attributes) do
    {
      name:      'Example Book',
      slug:      'example-book',
      shortcode: 'eb',
      data:      {
        'official'         => true,
        'playtest'         => true,
        'publication_date' => '1982-07-09'
      }
    }
  end

  include_contract 'should be a source',
    type: 'Sources::Book'

  include_contract 'should define data property', :publication_date

  describe '#homebrew?' do
    include_examples 'should define predicate', :homebrew?, false
  end

  describe '#valid?' do
    context 'when the source has a game system and a publisher' do
      let(:game_system) { FactoryBot.create(:game_system, :with_publisher) }
      let(:publisher)   { FactoryBot.create(:publisher) }
      let(:attributes) do
        super().merge(game_system: game_system, publisher: publisher)
      end

      it { expect(book.valid?).to be true }
    end
  end
end
