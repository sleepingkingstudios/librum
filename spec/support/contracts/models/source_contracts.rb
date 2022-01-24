# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts/model_contracts'
require 'support/contracts/models'
require 'support/contracts/models/attributes_contracts'
require 'support/contracts/models/validation_contracts'

module Spec::Support::Contracts::Models
  module SourceContracts
    include Spec::Support::Contracts::ModelContracts

    module ShouldBeASourceContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |type:, **options|
        include Spec::Support::Contracts::Models::SourceContracts

        options[:game_system_ids] ||= Array.new(2) { SecureRandom.uuid }

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

        include_contract 'should define data property',
          :official,
          predicate: true
        include_contract 'should define data property',
          :playtest,
          predicate: true

        describe '#type' do
          include_examples 'should define reader', :type, type
        end

        ### Associations
        include_contract 'should belong to',
          :game_system,
          association: -> { FactoryBot.create(:game_system, :with_publisher) }
        include_contract 'should belong to',
          :publisher

        describe '#valid?' do
          let(:factory_name) do
            described_class.name.split('::').last.underscore.intern
          end
          let(:game_system) do
            FactoryBot.create(
              :game_system,
              :with_publisher,
              id: options[:game_system_ids].first
            )
          end
          let(:other_game_system) do
            FactoryBot.create(
              :game_system,
              :with_publisher,
              id: options[:game_system_ids].last
            )
          end

          before(:example) do
            game_system.save!
            other_game_system.save!
          end

          include_contract 'should validate the presence of',
            :game_system,
            message: 'must exist'

          include_contract 'should validate the presence of',
            :publisher,
            message: 'must exist'

          include_contract 'should validate the presence of',
            :name,
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
          include_contract 'should validate the presence of',
            :slug,
            type: String

          unless type.nil?
            include_contract 'should validate the scoped uniqueness of',
              :slug,
              scope:      { game_system_id: options[:game_system_ids] },
              attributes: lambda {
                FactoryBot.attributes_for(
                  factory_name,
                  publisher: FactoryBot.create(:publisher)
                )
              }
          end
        end
      end
    end

    module ShouldDefineDataProperty
      extend RSpec::SleepingKingStudios::Contract

      contract do |property_name, predicate: false|
        describe "##{property_name}" do
          it 'should define the reader' do
            expect(subject)
              .to define_reader(property_name)
              .with_value(attributes[:data][property_name.to_s])
          end
        end

        describe "##{property_name}=" do
          let(:writer_name) { :"#{property_name}=" }

          it { expect(subject).to define_writer(property_name) }

          it 'should set the property' do
            expect { subject.send(writer_name, 'new value') }
              .to change(subject, property_name)
              .to be == 'new value'
          end

          it 'should update the data' do
            expect { subject.send(writer_name, 'new value') }
              .to change { subject.data[property_name.to_s] }
              .to be == 'new value'
          end

          context 'when the data includes the value' do
            let(:attributes) do
              data = super()[:data].merge({ property_name.to_s => 'old value' })

              super().merge(data: data)
            end

            it 'should set the property' do
              expect { subject.send(writer_name, 'new value') }
                .to change(subject, property_name)
                .to be == 'new value'
            end

            it 'should update the data' do
              expect { subject.send(writer_name, 'new value') }
                .to change { subject.data[property_name.to_s] }
                .to be == 'new value'
            end
          end
        end

        describe "##{property_name}?" do
          let(:predicate_name) { :"#{property_name}?" }

          if predicate
            it 'should define the predicate' do
              expect(subject).to define_predicate(predicate_name)
            end

            context 'when the value is nil' do
              let(:attributes) do
                data =
                  super()[:data].merge({ property_name.to_s => nil })

                super().merge(data: data)
              end

              it { expect(subject.send(predicate_name)).to be false }
            end

            context 'when the value is false' do
              let(:attributes) do
                data =
                  super()[:data].merge({ property_name.to_s => false })

                super().merge(data: data)
              end

              it { expect(subject.send(predicate_name)).to be false }
            end

            context 'when the value is true' do
              let(:attributes) do
                data =
                  super()[:data].merge({ property_name.to_s => true })

                super().merge(data: data)
              end

              it { expect(subject.send(predicate_name)).to be true }
            end

            context 'when the value is an empty String' do
              let(:attributes) do
                data =
                  super()[:data].merge({ property_name.to_s => '' })

                super().merge(data: data)
              end

              it { expect(subject.send(predicate_name)).to be false }
            end

            context 'when the value is a non-empty String' do
              let(:attributes) do
                data =
                  super()[:data].merge({ property_name.to_s => 'value' })

                super().merge(data: data)
              end

              it { expect(subject.send(predicate_name)).to be true }
            end
          else
            it { expect(subject).not_to define_predicate(predicate_name) }
          end
        end
      end
    end
  end
end
