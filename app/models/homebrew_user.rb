# frozen_string_literal: true

# Helper for defining homebrew source association.
module HomebrewUser
  extend Utils::IncludeOnce

  class << self
    private

    def included_once(other)
      super

      other.instance_exec do
        has_one :homebrew_source,
          class_name: 'Sources::Homebrew',
          dependent:  :destroy
      end
    end
  end
end
