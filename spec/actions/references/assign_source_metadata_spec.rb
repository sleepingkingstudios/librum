# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Actions::References::AssignSourceMetadata do
  subject(:action) { described_class.new(action_name, entity) }

  let(:action_name)     { :create }
  let(:entity)          { nil }
  let(:described_class) { Spec::Action }

  example_class 'Spec::Action', Cuprum::Command do |klass|
    klass.prepend(Actions::References::AssignSourceMetadata) # rubocop:disable RSpec/DescribedClass

    klass.define_method(:initialize) do |action, entity = nil|
      @action = action
      @entity = entity
    end

    klass.attr_reader :action, :entity

    klass.define_method(:create_entity) do |attributes:|
      attributes
    end

    klass.define_method(:repository) do
      @repository ||= Cuprum::Rails::Repository.new
    end

    klass.define_method(:update_entity) do |attributes:|
      attributes
    end

    klass.define_method(:process) do |attributes:|
      if action == :create
        create_entity(attributes: attributes)
      else
        update_entity(attributes: attributes)
      end
    end
  end

  describe '#call' do
    context 'when the action is create' do
      let(:action_name) { :create }

      describe 'with an empty attributes Hash' do
        let(:expected_attributes) { { 'source_metadata' => {} } }

        it 'should clear the source metadata' do
          expect(action.call(attributes: {}))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end

      describe 'with an attributes hash with source: a record' do
        let(:source)     { FactoryBot.build(:book) }
        let(:attributes) { { 'name' => 'Widget', 'source' => source } }
        let(:expected_attributes) do
          attributes.merge('source_metadata' => source.metadata)
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end

      describe 'with an attributes hash with source_id: an invalid value' do
        let(:source_id)  { SecureRandom.uuid }
        let(:attributes) { { 'name' => 'Widget', 'source_id' => source_id } }
        let(:expected_error) do
          Cuprum::Collections::Errors::NotFound.new(
            attribute_name:  :id,
            attribute_value: source_id,
            collection_name: 'sources',
            primary_key:     true
          )
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end
      end

      describe 'with an attributes hash with source_id: an valid value' do
        let(:source) do
          FactoryBot.create(:book, :with_game_system, :with_publisher)
        end
        let(:attributes) { { 'name' => 'Widget', 'source_id' => source.id } }
        let(:expected_attributes) do
          attributes.merge('source_metadata' => source.metadata)
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end
    end

    context 'when the action is update' do
      let(:action_name) { :update }
      let(:existing_source) do
        FactoryBot.create(:website, :with_game_system, :with_publisher)
      end
      let(:entity) do
        FactoryBot.create(:'dnd5e/condition', source: existing_source)
      end

      describe 'with an empty attributes Hash' do
        let(:expected_attributes) do
          { 'source_metadata' => existing_source.metadata }
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: {}))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end

      describe 'with an attributes hash with source: a record' do
        let(:source)     { FactoryBot.build(:book) }
        let(:attributes) { { 'name' => 'Widget', 'source' => source } }
        let(:expected_attributes) do
          attributes.merge('source_metadata' => source.metadata)
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end

      describe 'with an attributes hash with source_id: an invalid value' do
        let(:source_id)  { SecureRandom.uuid }
        let(:attributes) { { 'name' => 'Widget', 'source_id' => source_id } }
        let(:expected_error) do
          Cuprum::Collections::Errors::NotFound.new(
            attribute_name:  :id,
            attribute_value: source_id,
            collection_name: 'sources',
            primary_key:     true
          )
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end
      end

      describe 'with an attributes hash with source_id: an valid value' do
        let(:source) do
          FactoryBot.create(:book, :with_game_system, :with_publisher)
        end
        let(:attributes) { { 'name' => 'Widget', 'source_id' => source.id } }
        let(:expected_attributes) do
          attributes.merge('source_metadata' => source.metadata)
        end

        it 'should assign the source metadata' do
          expect(action.call(attributes: attributes))
            .to be_a_passing_result
            .with_value(expected_attributes)
        end
      end
    end
  end
end
