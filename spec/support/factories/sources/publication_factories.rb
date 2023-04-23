# frozen_string_literal: true

FactoryBot.define do
  factory :publication, class: 'Sources::Publication', parent: :source do
    transient do
      sequence(:publication_index) { |index| index }
    end

    name { "Publication #{source_index}" }
    slug { "publication-#{source_index}" }
    official { true }
    playtest { false }
  end
end
