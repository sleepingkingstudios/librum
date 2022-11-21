# frozen_string_literal: true

FactoryBot.define do
  factory :game_setting, class: 'GameSetting' do
    id { SecureRandom.uuid }

    transient do
      sequence(:setting_index) { |index| index }
    end

    name { "Game Setting #{setting_index}" }
    slug { "game-setting-#{setting_index}" }

    trait :with_publisher do
      publisher { create(:publisher) }
    end
  end
end
