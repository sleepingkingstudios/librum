# frozen_string_literal: true

FactoryBot.define do
  factory :authentication_credential, class: 'Authentication::Credential' do
    id { SecureRandom.uuid }

    data       { {} }
    active     { false }
    expires_at { 1.year.from_now }

    trait :active do
      active { true }
    end

    trait :expired do
      expires_at { 1.hour.ago }
    end

    trait :with_user do
      user { create(:authentication_user) }
    end
  end

  factory :generic_credential,
    class:  'Authentication::GenericCredential',
    parent: :authentication_credential
end
