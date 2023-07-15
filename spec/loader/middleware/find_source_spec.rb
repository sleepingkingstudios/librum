# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'

RSpec.describe Loader::Middleware::FindSource do
  subject(:middleware) do
    described_class.new(
      attribute_name,
      game_system: game_system_slug,
      repository:  repository
    )
  end

  let(:attribute_name)   { 'source' }
  let(:game_system_slug) { 'example-game-system' }
  let(:repository)       { Cuprum::Rails::Repository.new }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(1).argument
        .and_keywords(:game_system, :repository)
    end
  end

  describe '#attribute_name' do
    include_examples 'should define reader',
      :attribute_name,
      -> { be == attribute_name }
  end

  describe '#call' do
    shared_context 'when the game systems collection exists' do
      before(:example) do
        repository.find_or_create(record_class: Librum::Tabletop::GameSystem)
      end
    end

    shared_context 'when the sources collection exists' do
      before(:example) do
        repository.find_or_create(record_class: Librum::Tabletop::Source)
      end
    end

    shared_context 'with a valid game system' do
      let(:publisher) do
        FactoryBot.build(:publisher)
      end
      let(:game_system) do
        FactoryBot.build(:game_system, publisher: publisher)
      end
      let(:game_system_slug) { game_system.slug }

      before(:example) do
        publisher.save!
        game_system.save!
      end
    end

    shared_examples 'should require the game systems collection exists' do
      context 'when the game systems collection does not exist' do
        let(:expected_error) do
          Cuprum::Collections::Loader::Errors::CollectionError.new(
            qualified_name: 'librum/tabletop/game_systems',
            repository:     repository
          )
        end

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end
    end

    shared_examples 'should require the sources collection exists' do
      context 'when the sources collection does not exist' do
        include_context 'when the game systems collection exists'
        include_context 'with a valid game system'

        let(:expected_error) do
          Cuprum::Collections::Loader::Errors::CollectionError.new(
            qualified_name: 'librum/tabletop/sources',
            repository:     repository
          )
        end

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end
    end

    let(:attributes) { { 'source' => SecureRandom.uuid } }
    let(:next_command) do
      Cuprum::Command.new { |hsh| hsh.merge({ 'ok' => true }) }
    end

    it 'should define the method' do
      expect(middleware)
        .to be_callable
        .with(1).argument
        .and_keywords(:attributes)
    end

    include_examples 'should require the game systems collection exists'

    include_examples 'should require the sources collection exists'

    context 'when the game system does not exist' do
      include_context 'when the game systems collection exists'
      include_context 'when the sources collection exists'

      let(:expected_error) do
        Cuprum::Collections::Errors::NotFound.new(
          attributes:      { 'slug' => game_system_slug },
          collection_name: 'game_systems'
        )
      end

      context 'when the game system slug is nil' do
        let(:game_system_slug) { nil }

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end

      context 'when the game system slug is a value' do
        let(:game_system_slug) { SecureRandom.uuid }

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end
    end

    context 'when the association does not exist' do
      include_context 'when the game systems collection exists'
      include_context 'when the sources collection exists'
      include_context 'with a valid game system'

      let(:expected_error) do
        Cuprum::Collections::Errors::NotFound.new(
          attributes:      {
            'slug'           => attributes[attribute_name],
            'game_system_id' => game_system.id
          },
          collection_name: 'sources'
        )
      end

      context 'when the attribute value is nil' do
        let(:attributes) { {} }

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end

      context 'when the attribute value is a value' do
        let(:attributes) { { 'source' => 'example-source' } }

        it 'should return a failing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not call the next command' do
          allow(next_command).to receive(:call)

          middleware.call(next_command, attributes: attributes)

          expect(next_command).not_to have_received(:call)
        end
      end
    end

    context 'when the association exists' do
      include_context 'when the game systems collection exists'
      include_context 'when the sources collection exists'
      include_context 'with a valid game system'

      let(:association) do
        FactoryBot.build(
          :book,
          game_system: game_system,
          publisher:   publisher
        )
      end
      let(:attributes) do
        {
          'name'   => 'Example Reference',
          'source' => association.slug
        }
      end
      let(:expected_value) do
        {
          attributes: attributes.merge(attribute_name => association),
          'ok' => true
        }
      end

      before(:example) do
        association.save!
      end

      it 'should return a passing result' do
        expect(middleware.call(next_command, attributes: attributes))
          .to be_a_passing_result
          .with_value(expected_value)
      end

      it 'should call the next command' do
        allow(next_command).to receive(:call)

        middleware.call(next_command, attributes: attributes)

        expect(next_command)
          .to have_received(:call)
          .with(attributes: attributes.merge(attribute_name => association))
      end
    end
  end

  describe '#game_system_slug' do
    include_examples 'should define reader',
      :game_system_slug,
      -> { game_system_slug }
  end

  describe '#repository' do
    include_examples 'should define reader', :repository, -> { repository }
  end
end
