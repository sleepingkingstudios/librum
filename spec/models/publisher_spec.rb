# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/model_contracts'

RSpec.describe Publisher, type: :model do
  include Spec::Support::Contracts::ModelContracts

  subject(:publisher) { described_class.new(attributes) }

  let(:attributes) do
    {
      name:    'Example Publisher',
      slug:    'example-publisher',
      website: 'www.example.com'
    }
  end

  include_contract 'should be a model'

  ### Attributes
  include_contract 'should define attribute',
    :name,
    default: ''
  include_contract 'should define attribute',
    :website,
    default: ''

  ### Associations
  include_contract 'should have many', :game_systems

  describe '#valid?' do
    it { expect(publisher.valid?).to be true }

    include_contract 'should validate the presence of',   :name, type: String
    include_contract 'should validate the uniqueness of', :name

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
    include_contract 'should validate the presence of',   :slug, type: String
    include_contract 'should validate the uniqueness of', :slug
  end
end
