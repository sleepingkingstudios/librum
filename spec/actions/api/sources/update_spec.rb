# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/update_contracts'

RSpec.describe Actions::Api::Sources::Update do
  include Cuprum::Rails::RSpec::Actions::UpdateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(
        collection_name: 'books',
        record_class:    Sources::Book
      ),
      permitted_attributes: %i[
        game_system_id
        publisher_id
        name
        slug
        official
        playtest
        publication_date
      ],
      resource_class:       Sources::Book
    )
  end
  let(:source) do
    FactoryBot.create(:book, :with_game_system, :with_publisher)
  end
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:valid_attributes) do
    { 'name' => 'Example Source' }
  end

  include_contract 'update action contract',
    existing_entity:    -> { source },
    invalid_attributes: -> { invalid_attributes },
    valid_attributes:   -> { valid_attributes },
    primary_key_value:  -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) do
        { 'id' => source.slug, 'book' => valid_attributes }
      end

      include_contract 'should update the entity',
        existing_entity:  -> { source },
        valid_attributes: -> { valid_attributes },
        params:           -> { params }
    end

    describe 'with slug: an empty String' do
      let(:valid_attributes)    { super().merge({ 'slug' => '' }) }
      let(:expected_attributes) { { 'slug' => 'example-source' } }

      include_contract 'should update the entity',
        existing_entity:     -> { source },
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { hsh.merge(expected_attributes) }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should update the entity',
        existing_entity:  -> { source },
        valid_attributes: -> { valid_attributes }
    end
  end
end
