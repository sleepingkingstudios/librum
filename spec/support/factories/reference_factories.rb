# frozen_string_literal: true

FactoryBot.define do
  factory :reference, class: 'Reference' do
    id { SecureRandom.uuid }

    transient do
      sequence(:reference_index) { |index| index }
    end

    name { "Reference #{reference_index}" }
    slug { "reference-#{reference_index}" }

    trait :with_source do
      source { create(:book, :with_game_system, :with_publisher) }
    end
  end

  factory :generic_reference, class: 'GenericReference', parent: :reference do
    details { 'Zzzzz...' }
  end
end
