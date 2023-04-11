# frozen_string_literal: true

FactoryBot.define do
  factory :source, class: 'Source' do
    id { SecureRandom.uuid }

    transient do
      sequence(:source_index) { |index| index }
    end

    name { "Source #{source_index}" }
    slug { "source-#{source_index}" }

    trait :with_game_setting do
      # :nocov:
      game_setting do
        create(:game_setting, publisher: (publisher || create(:publisher)))
      end
      # :nocov:
    end

    trait :with_game_system do
      # :nocov:
      game_system do
        create(:game_system, publisher: (publisher || create(:publisher)))
      end
      # :nocov:
    end

    trait :with_publisher do
      publisher { create(:publisher) }
    end
  end
end
