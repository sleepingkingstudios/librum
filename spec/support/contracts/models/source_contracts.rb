# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts/model_contracts'
require 'support/contracts/models'
require 'support/contracts/models/attributes_contracts'
require 'support/contracts/models/data_properties_contracts'
require 'support/contracts/models/validation_contracts'

module Spec::Support::Contracts::Models
  module SourceContracts
    include Spec::Support::Contracts::ModelContracts
    include Spec::Support::Contracts::Models::DataPropertiesContracts

    module ShouldBeASourceContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |type:, **options|
        include Spec::Support::Contracts::Models::SourceContracts

        options[:game_system_ids] ||= Array.new(2) { SecureRandom.uuid }
        options[:publisher_ids]   ||= Array.new(2) { SecureRandom.uuid }

        include_contract 'should be a model'

        ### Attributes
        include_contract 'should define attribute',
          :name,
          default: ''
        include_contract 'should define attribute',
          :slug,
          default: ''
        include_contract 'should define attribute',
          :data,
          default: {}
        include_contract 'should define attribute',
          :game_setting_id,
          value: nil
        include_contract 'should define attribute',
          :publisher_id,
          value: nil
        include_contract 'should define attribute',
          :user_id,
          value: nil

        include_contract 'should define data properties'

        describe '#homebrew?' do
          include_examples 'should define predicate', :homebrew?
        end

        describe '#legacy?' do
          include_examples 'should define predicate', :legacy?
        end

        describe '#metadata' do
          let(:expected) do
            {
              'homebrew' => subject.homebrew?,
              'legacy'   => subject.legacy?,
              'official' => subject.official?,
              'playtest' => subject.playtest?
            }
          end

          include_examples 'should define reader',
            :metadata,
            -> { be >= expected }
        end

        describe '#official?' do
          include_examples 'should define predicate', :official?
        end

        describe '#playtest?' do
          include_examples 'should define predicate', :playtest?
        end

        describe '#type' do
          include_examples 'should define reader', :type, type
        end

        describe '#valid?' do
          include_contract 'should validate the presence of',
            :name,
            type: String

          include_contract 'should validate the presence of',
            :slug,
            type: String

          include_contract 'should validate the format of',
            :slug,
            message:     'must be in kebab-case',
            matching:    {
              'example'               => 'a lowercase string',
              'example-slug'          => 'a kebab-case string',
              'example-compound-slug' => # rubocop:disable Layout/HashAlignment
                'a kebab-case string with multiple words',
              '1st-example'           => 'a kebab-case string with digits'
            },
            nonmatching: {
              'InvalidSlug'   => 'a string with capital letters',
              'invalid slug'  => 'a string with whitespace',
              'invalid_slug'  => 'a string with underscores',
              '-invalid-slug' => 'a string with leading dash',
              'invalid-slug-' => 'a string with trailing dash'
            }
        end
      end
    end

    module ShouldBeAPublicationContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |type:, **options|
        include Spec::Support::Contracts::Models::SourceContracts

        options[:game_system_ids] ||= Array.new(2) { SecureRandom.uuid }
        options[:publisher_ids]   ||= Array.new(2) { SecureRandom.uuid }

        include_contract('should be a source', type: type, **options)

        ### Associations
        include_contract 'should belong to',
          :game_setting,
          association: -> { FactoryBot.create(:game_setting, :with_publisher) }
        include_contract 'should belong to',
          :game_system,
          association: -> { FactoryBot.create(:game_system, :with_publisher) }
        include_contract 'should belong to',
          :publisher

        include_contract 'should define data property',
          :legacy,
          predicate: true
        include_contract 'should define data property',
          :official,
          predicate: true
        include_contract 'should define data property',
          :playtest,
          predicate: true

        describe '#homebrew?' do
          it { expect(subject.homebrew?).to be false }
        end

        describe '#metadata' do
          let(:expected) do
            {
              'homebrew' => false,
              'legacy'   => subject.legacy?,
              'official' => subject.official?,
              'playtest' => subject.playtest?
            }
          end

          context 'when the source is a legacy source' do
            let(:attributes) do
              attributes = super()
              data       = attributes.fetch(:data, {}).merge(legacy: true)

              attributes.merge(data: data)
            end

            it { expect(subject.metadata).to be == expected }
          end

          context 'when the source is an official source' do
            let(:attributes) do
              attributes = super()
              data       = attributes.fetch(:data, {}).merge(official: true)

              attributes.merge(data: data)
            end

            it { expect(subject.metadata).to be == expected }
          end

          context 'when the source is a playtest source' do
            let(:attributes) do
              attributes = super()
              data       = attributes.fetch(:data, {}).merge(playtest: true)

              attributes.merge(data: data)
            end

            it { expect(subject.metadata).to be == expected }
          end
        end

        describe '#valid?' do
          let(:attributes) do
            super().merge(
              game_system: game_system,
              publisher:   publisher
            )
          end
          let(:factory_name) do
            described_class.name.split('::').last.underscore.intern
          end
          let(:publisher) do
            FactoryBot.create(
              :publisher,
              id: options[:publisher_ids].first
            )
          end
          let(:other_publisher) do
            FactoryBot.create(
              :publisher,
              id: options[:publisher_ids].last
            )
          end
          let(:game_system) do
            FactoryBot.create(
              :game_system,
              id:        options[:game_system_ids].first,
              publisher: publisher
            )
          end
          let(:other_game_system) do
            FactoryBot.create(
              :game_system,
              id:        options[:game_system_ids].last,
              publisher: other_publisher
            )
          end

          before(:example) do
            publisher.save!
            other_publisher.save!

            game_system.save!
            other_game_system.save!
          end

          include_contract 'should validate the presence of',
            :game_system,
            message: 'must exist'

          include_contract 'should validate the presence of',
            :publisher,
            message: 'must exist'

          context 'with a game system and publisher' do
            include_contract 'should validate the scoped uniqueness of',
              :name,
              scope:      {
                game_system_id: options[:game_system_ids],
                publisher_id:   options[:publisher_ids]
              },
              attributes: lambda {
                FactoryBot.attributes_for(factory_name)
              }

            include_contract 'should validate the scoped uniqueness of',
              :slug,
              scope:      { game_system_id: options[:game_system_ids] },
              attributes: lambda {
                FactoryBot.attributes_for(
                  factory_name,
                  :with_publisher
                )
              }
          end
        end
      end
    end
  end
end
