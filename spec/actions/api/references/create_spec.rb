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
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(
        record_class: GenericReference
      ),
      permitted_attributes: %i[
        name
        slug
        stub
        details
        source_id
      ],
      resource_class:       GenericReference
    )
  end
  let(:source) { FactoryBot.create(:book, :with_game_system, :with_publisher) }
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:valid_attributes) do
    {
      'name'      => 'Widget',
      'details'   => 'Some sort of self-sealing stem bolt?',
      'source_id' => source.id
    }
  end
  let(:failure_attributes) { { 'slug' => '', 'source_metadata' => {} } }
  let(:expected_attributes) do
    {
      'slug'            => 'widget',
      'source_metadata' => source.metadata
    }
  end

  include_contract 'create action contract',
    invalid_attributes:             -> { invalid_attributes },
    valid_attributes:               -> { valid_attributes },
    expected_attributes_on_failure: ->(hsh) { hsh.merge(failure_attributes) },
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
