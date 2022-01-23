# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/create_contracts'

RSpec.describe Actions::Api::Sources::Create do
  include Cuprum::Rails::RSpec::Actions::CreateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    collection = repository.find_or_create(record_class: Sources::Book)

    Cuprum::Rails::Resource.new(
      collection:           collection,
      permitted_attributes: %i[
        game_system_id
        publisher_id
        name
        slug
        shortcode
        official
        playtest
        publication_date
      ],
      resource_class:       Sources::Book
    )
  end
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:publisher) { FactoryBot.create(:publisher) }
  let(:game_system) { FactoryBot.create(:game_system, publisher: publisher) }
  let(:valid_attributes) do
    {
      'game_system_id'   => game_system.id,
      'publisher_id'     => publisher.id,
      'name'             => 'Example Book',
      'shortcode'        => 'eb',
      'official'         => true,
      'playtest'         => false,
      'publication_date' => '1982-07-09'
    }
  end
  let(:expected_attributes) do
    { 'slug' => 'example-book' }
  end

  before(:example) do
    publisher.save!
    game_system.save!
  end

  def extract_data_attributes(hsh)
    hsh
      .merge(
        'data' => hsh.slice(
          'official',
          'playtest',
          'publication_date'
        )
      )
      .except('official', 'playtest', 'publication_date')
  end

  include_contract 'create action contract',
    invalid_attributes:             -> { invalid_attributes },
    valid_attributes:               -> { valid_attributes },
    expected_attributes_on_failure: ->(hsh) { hsh.merge({ 'slug' => '' }) },
    expected_attributes_on_success: lambda { |hsh|
      extract_data_attributes(hsh).merge(expected_attributes)
    },
    expected_value_on_success:      lambda {
      { 'book' => Sources::Book.where(slug: 'example-book').first }
    } \
  do
    describe 'with slug: an empty String' do
      let(:valid_attributes) { super().merge({ 'slug' => '' }) }

      include_contract 'should create the entity',
        valid_attributes:    -> { valid_attributes },
        expected_attributes: lambda { |hsh|
          extract_data_attributes(hsh).merge(expected_attributes)
        }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should create the entity',
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { extract_data_attributes(hsh) }
    end
  end
end
