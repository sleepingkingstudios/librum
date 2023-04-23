# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Sources::Website do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:website) { described_class.new(attributes) }

  let(:attributes) do
    {
      name: 'Example Website',
      slug: 'example-website',
      data: {
        'official' => true,
        'playtest' => true,
        'base_url' => 'www.example.com'
      }
    }
  end

  include_contract 'should be a publication',
    type: 'Sources::Website'

  include_contract 'should define data property', :base_url

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

      it { expect(website.valid?).to be true }
    end

    include_contract 'should validate the presence of',
      :base_url,
      attributes: lambda { |hsh|
        hsh.merge(data: hsh[:data].merge('base_url' => hsh[:base_url]))
      },
      type:       String
  end
end
