# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/create_contracts'

RSpec.describe Actions::Api::GameSystems::Create do
  include Cuprum::Rails::RSpec::Actions::CreateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(record_class: GameSystem),
      permitted_attributes: %i[
        publisher_id
        name
        slug
        website
      ],
      resource_class:       GameSystem
    )
  end
  let(:publisher) { FactoryBot.create(:publisher) }
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:valid_attributes) do
    {
      'publisher_id' => publisher.id,
      'name'         => 'Example Game'
    }
  end
  let(:expected_attributes) do
    { 'slug' => 'example-game' }
  end

  before(:example) { publisher.save }

  include_contract 'create action contract',
    invalid_attributes:             -> { invalid_attributes },
    valid_attributes:               -> { valid_attributes },
    expected_attributes_on_failure: ->(hsh) { hsh.merge({ 'slug' => '' }) },
    expected_attributes_on_success: ->(hsh) { hsh.merge(expected_attributes) } \
  do
    describe 'with slug: an empty String' do
      let(:valid_attributes) { super().merge({ 'slug' => '' }) }

      include_contract 'should create the entity',
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { hsh.merge(expected_attributes) }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should create the entity',
        valid_attributes: -> { valid_attributes }
    end
  end
end
