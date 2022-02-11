# frozen_string_literal: true

FactoryBot.define do
  factory :book, class: 'Sources::Book', parent: :source do
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

    trait :sourcebook do
      category { Sources::Book::Categories::SOURCEBOOK }
    end
  end
end
