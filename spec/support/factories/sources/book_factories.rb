# frozen_string_literal: true

FactoryBot.define do
  factory :book, class: 'Sources::Book', parent: :publication do
    transient do
      sequence(:book_index) { |index| index }
    end

    name { "Book #{book_index}" }
    slug { "book-#{book_index}" }

    category         { Sources::Book::Categories::SOURCEBOOK }
    publication_date { '1982-07-09' }

    trait :adventure do
      category { Sources::Book::Categories::ADVENTURE }
    end

    trait :bestiary do
      category { Sources::Book::Categories::BESTIARY }
    end

    trait :reference do
      category { Sources::Book::Categories::REFERENCE }
    end

    trait :setting do
      with_game_setting

      category { Sources::Book::Categories::SETTING }
    end

    trait :sourcebook do
      category { Sources::Book::Categories::SOURCEBOOK }
    end
  end
end
