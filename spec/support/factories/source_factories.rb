# frozen_string_literal: true

FactoryBot.define do
  factory :source, class: 'Source' do
    id { SecureRandom.uuid }

    transient do
      sequence(:source_index) { |index| index }
    end

    name { "Source #{source_index}" }
    slug { "source-#{source_index}" }
    shortcode { "s#{source_index}" }
    official { true }
    playtest { false }

    trait :with_game_system do
      game_system do
        create(:game_system, publisher: (publisher || create(:publisher)))
      end
    end

    trait :with_publisher do
      publisher { create(:publisher) }
    end
  end
end
