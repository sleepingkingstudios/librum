# frozen_string_literal: true

FactoryBot.define do
  factory :'dnd5e/condition', class: 'Dnd5e::Condition', parent: :reference do
    transient do
      sequence(:condition_index) { |index| index }
    end

    name { "Condition #{condition_index}" }
    slug { name.tr(' ', '_').underscore.tr('_', '-') }

    short_description do
      'A short description of the condition.'
    end

    description do
      'A somewhat longer description of the condition.' \
        "\n" \
        "\nMultiline."
    end
  end
end
