# frozen_string_literal: true

FactoryBot.define do
  factory :website, class: 'Sources::Website', parent: :source do
    transient do
      sequence(:website_index) { |index| index }
    end

    name { "Website #{website_index}" }
    slug { "website-#{website_index}" }

    base_url { 'www.example.com' }
  end
end
