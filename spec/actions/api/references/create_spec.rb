# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/create_contracts'

RSpec.describe Actions::Api::References::Create do
  include Cuprum::Rails::RSpec::Actions::CreateContracts

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
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:source) { FactoryBot.create(:book, :with_game_system, :with_publisher) }
  let(:valid_attributes) do
    {
      'source_id' => source.id,
      'name'      => 'Example Reference',
      'stub'      => false,
      'details'   => 'Probably not important...'
    }
  end
  let(:expected_attributes) do
    { 'slug' => 'example-reference' }
  end

  before(:example) { source.save! }

  include_contract 'create action contract',
    invalid_attributes:             -> { invalid_attributes },
    valid_attributes:               -> { valid_attributes },
    expected_attributes_on_failure: ->(hsh) { hsh.merge({ 'slug' => '' }) },
    expected_attributes_on_success: ->(hsh) { hsh.merge(expected_attributes) },
    expected_value_on_success:      lambda {
      {
        'generic_reference' => GenericReference
          .where(slug: 'example-reference')
          .first
      }
    } \
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
