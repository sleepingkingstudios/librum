# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/model_contracts'

RSpec.describe GameSetting, type: :model do
  include Spec::Support::Contracts::ModelContracts

  subject(:game_setting) { described_class.new(attributes) }

  let(:attributes) do
    {
      name: 'Example Setting',
      slug: 'example-setting'
    }
  end

  include_contract 'should be a model'

  ### Attributes
  include_contract 'should define attribute',
    :name,
    default: ''

  ### Associations
  include_contract 'should belong to', :publisher

  include_contract 'should have many',
    :sources,
    association:    lambda {
      Array.new(3) do
        FactoryBot.build(
          :book,
          :with_game_system,
          :with_publisher,
          game_setting: game_setting
        )
      end
    },
    before_example: lambda {
      game_setting.publisher = FactoryBot.create(:publisher)
    }

  describe '#valid?' do
    let(:publisher) { FactoryBot.create(:publisher) }

    context 'when the game system has a publisher' do
      let(:attributes) { super().merge(publisher: publisher) }

      it { expect(game_setting.valid?).to be true }
    end

    include_contract 'should validate the presence of', :name, type: String
    include_contract 'should validate the uniqueness of',
      :name,
      attributes: lambda {
        FactoryBot.attributes_for(:game_setting, publisher: publisher)
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
