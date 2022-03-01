# frozen_string_literal: true

FactoryBot.define do
  factory :authentication_user, class: 'Authentication::User' do
    id { SecureRandom.uuid }

    transient do
      sequence(:user_index) { |index| index }
    end

    email    { "user.#{user_index}@example.com" }
    username { "User #{user_index}" }
    slug     { "user-#{user_index}" }
    role     { Authentication::User::Roles::USER }

    trait :admin do
      role { Authentication::User::Roles::ADMIN }
    end

    trait :guest do
      role { Authentication::User::Roles::GUEST }
    end

    trait :superadmin do
      role { Authentication::User::Roles::SUPERADMIN }
    end
  end
end
