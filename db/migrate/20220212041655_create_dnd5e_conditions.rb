# frozen_string_literal: true

class CreateDnd5eConditions < ActiveRecord::Migration[7.0]
  def change
    create_table :dnd5e_conditions, id: :uuid do |t|
      # Common columns for Reference subclasses.
      t.string  :name,            null: false, default: ''
      t.string  :slug,            null: false, default: ''
      t.boolean :stub,            null: false, default: false
      t.jsonb   :source_metadata, null: false, default: {}

      # Implementation-specific columns.
      t.string :short_description, null: false, default: ''
      t.text   :description,       null: false, default: ''

      t.timestamps
    end

    add_reference :dnd5e_conditions,
      :source,
      index: true,
      type:  :uuid

    add_index :dnd5e_conditions, %i[source_id slug], unique: true
    add_index :dnd5e_conditions, :slug
  end
end
