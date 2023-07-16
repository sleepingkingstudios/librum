# frozen_string_literal: true

FactoryBot.define do
  factory :authentication_user,
    class:   'Librum::Iam::User',
    aliases: %i[user] \
  do
    id { SecureRandom.uuid }

    transient do
      sequence(:user_index) { |index| index }
    end

    email    { "user.#{user_index}@example.com" }
    username { "User #{user_index}" }
    slug     { "user-#{user_index}" }
    role     { Librum::Iam::User::Roles::USER }

    trait :admin do
      role { Librum::Iam::User::Roles::ADMIN }
    end

    trait :guest do
      role { Librum::Iam::User::Roles::GUEST }
    end

    trait :superadmin do
      role { Librum::Iam::User::Roles::SUPERADMIN }
    end

    trait :with_homebrew do
      after(:create) do |user|
        # :nocov:
        create(:homebrew_source, user: user)
        # :nocov:
      end
    end
  end
end
