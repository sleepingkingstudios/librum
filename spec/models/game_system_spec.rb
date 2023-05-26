# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/model_contracts'

RSpec.describe GameSystem, type: :model do
  include Librum::Core::RSpec::Contracts::ModelContracts

  subject(:game_system) { described_class.new(attributes) }

  let(:attributes) do
    {
      name:    'Example Game System',
      slug:    'example-game-system',
      edition: ''
    }
  end

  include_contract 'should be a model'

  ### Attributes
  include_contract 'should define attribute',
    :edition,
    default: '',
    value:   '1st Edition'
  include_contract 'should define attribute',
    :name,
    default: ''

  ### Associations
  include_contract 'should belong to', :publisher

  describe '#valid?' do
    let(:publisher) { FactoryBot.create(:publisher) }

    context 'when the game system has a publisher' do
      let(:attributes) { super().merge(publisher: publisher) }

      it { expect(game_system.valid?).to be true }
    end

    include_contract 'should validate the scoped uniqueness of',
      :name,
      scope:      { edition: ['', '1st Edition', '2nd Edition'] },
      attributes: lambda {
        FactoryBot.attributes_for(:game_system, publisher: publisher)
      }

    include_contract 'should validate the format of',
      :slug,
      message:     'must be in kebab-case',
      matching:    {
        'example'               => 'a lowercase string',
        'example-slug'          => 'a kebab-case string',
        'example-compound-slug' => 'a kebab-case string with multiple words',
        '1st-example'           => 'a kebab-case string with digits'
      },
      nonmatching: {
        'InvalidSlug'   => 'a string with capital letters',
        'invalid slug'  => 'a string with whitespace',
        'invalid_slug'  => 'a string with underscores',
        '-invalid-slug' => 'a string with leading dash',
        'invalid-slug-' => 'a string with trailing dash'
      }
    include_contract 'should validate the presence of', :slug, type: String
    include_contract 'should validate the uniqueness of',
      :slug,
      attributes: -> { { publisher: FactoryBot.create(:publisher) } }
  end
end
