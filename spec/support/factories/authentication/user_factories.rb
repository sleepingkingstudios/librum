# frozen_string_literal: true

FactoryBot.define do
  factory :authentication_user, class: 'Authentication::User' do
    id { SecureRandom.uuid }

    transient do
      sequence(:user_index) { |index| index }
    end

    email    { "user.#{user_index}@example.com" }
    username { "User #{user_index}" }
  end
end
