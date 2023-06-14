# frozen_string_literal: true

FactoryBot.define do
  factory :publisher, class: 'Publisher' do
    id { SecureRandom.uuid }

    transient do
      sequence(:publisher_index) { |index| index }
    end

    name { "Publisher #{publisher_index}" }
    slug { name.tr(' ', '_').underscore.tr('_', '-') }
  end
end
