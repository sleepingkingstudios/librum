# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/update_contracts'

RSpec.describe Actions::Api::Admin::Authentication::Users::Update do
  include Cuprum::Rails::RSpec::Actions::UpdateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(
        record_class: Authentication::User
      ),
      permitted_attributes: %i[
        email
        role
        slug
        username
      ],
      resource_class:       Authentication::User
    )
  end
  let(:user) { FactoryBot.create(:authentication_user) }
  let(:invalid_attributes) do
    { 'username' => '' }
  end
  let(:valid_attributes) do
    { 'username' => 'Example User' }
  end

  include_contract 'update action contract',
    existing_entity:    -> { user },
    invalid_attributes: -> { invalid_attributes },
    valid_attributes:   -> { valid_attributes },
    primary_key_value:  -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) do
        { 'id' => user.slug, 'user' => valid_attributes }
      end

      include_contract 'should update the entity',
        existing_entity:  -> { user },
        valid_attributes: -> { valid_attributes },
        params:           -> { params }
    end

    describe 'with slug: an empty String' do
      let(:valid_attributes)    { super().merge({ 'slug' => '' }) }
      let(:expected_attributes) { { 'slug' => 'example-user' } }

      include_contract 'should update the entity',
        existing_entity:     -> { user },
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { hsh.merge(expected_attributes) }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should update the entity',
        existing_entity:  -> { user },
        valid_attributes: -> { valid_attributes }
    end
  end
end
