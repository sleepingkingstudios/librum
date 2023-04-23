# frozen_string_literal: true

FactoryBot.define do
  factory :homebrew, class: 'Sources::Homebrew', parent: :source do
    transient do
      mock_user { build(:authentication_user) }
    end

    name { "User: #{(user || mock_user).username}" }
    slug { "user-#{(user || mock_user).slug}" }

    trait :with_user do
      user { create(:authentication_user) }
    end
  end
end
