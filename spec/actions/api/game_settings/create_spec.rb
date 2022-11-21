# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/create_contracts'

RSpec.describe Actions::Api::GameSettings::Create do
  include Cuprum::Rails::RSpec::Actions::CreateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(
        record_class: GameSetting
      ),
      permitted_attributes: %i[
        name
        publisher_id
        slug
      ],
      resource_class:       GameSetting
    )
  end
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:publisher) { FactoryBot.create(:publisher) }
  let(:valid_attributes) do
    {
      'name'         => 'Example Game Setting',
      'publisher_id' => publisher.id
    }
  end
  let(:expected_attributes) do
    { 'slug' => 'example-game-setting' }
  end

  before(:example) do
    publisher.save!
  end

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
