# frozen_string_literal: true

# A temporary effect or malus applied to creatures or characters.
class Dnd5e::Condition < Dnd5e::Reference
  self.table_name = 'dnd5e_conditions'

  # Validations
  with_options unless: :stub? do
    validates :description, presence: true
  end
end
