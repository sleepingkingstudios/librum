# frozen_string_literal: true

module Spec::Support
  module Matchers
    extend RSpec::Matchers::DSL

    matcher :match_snapshot do |snapshot|
      match do |actual|
        actual.to_s.strip == snapshot.strip
      end
    end
  end
end
