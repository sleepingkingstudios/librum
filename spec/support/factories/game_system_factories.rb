# frozen_string_literal: true

FactoryBot.define do
  factory :game_system, class: 'GameSystem' do
    id { SecureRandom.uuid }

    transient do
      sequence(:game_system_index) { |index| index }
    end

    name { "Game System #{game_system_index}" }
    slug { "game-system-#{game_system_index}" }
  end
end
