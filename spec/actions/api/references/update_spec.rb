# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/update_contracts'

RSpec.describe Actions::Api::References::Update do
  include Cuprum::Rails::RSpec::Actions::UpdateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    collection = repository.find_or_create(record_class: GenericReference)

    Cuprum::Rails::Resource.new(
      collection:           collection,
      permitted_attributes: %i[
        source_id
        source_metadata
        name
        slug
        stub
        details
      ],
      resource_class:       GenericReference
    )
  end
  let(:reference) { FactoryBot.create(:generic_reference, :with_source) }
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:valid_attributes) do
    { 'name' => 'Example Reference' }
  end

  include_contract 'update action contract',
    existing_entity:    -> { reference },
    invalid_attributes: -> { invalid_attributes },
    valid_attributes:   -> { valid_attributes },
    primary_key_value:  -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) do
        { 'id' => reference.slug, 'generic_reference' => valid_attributes }
      end

      include_contract 'should update the entity',
        existing_entity:  -> { reference },
        valid_attributes: -> { valid_attributes },
        params:           -> { params }
    end

    describe 'with slug: an empty String' do
      let(:valid_attributes)    { super().merge({ 'slug' => '' }) }
      let(:expected_attributes) { { 'slug' => 'example-reference' } }

      include_contract 'should update the entity',
        existing_entity:     -> { reference },
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { hsh.merge(expected_attributes) }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should update the entity',
        existing_entity:  -> { reference },
        valid_attributes: -> { valid_attributes }
    end
  end
end
