# frozen_string_literal: true

class CreateGenericReferences < ActiveRecord::Migration[7.0]
  def change
    create_table :generic_references, id: :uuid do |t|
      # Common columns for Reference subclasses.
      t.string  :name,            null: false, default: ''
      t.string  :slug,            null: false, default: ''
      t.boolean :stub,            null: false, default: false
      t.jsonb   :source_metadata, null: false, default: {}

      # Implementation-specific columns.
      t.text    :details

      t.timestamps
    end

    add_reference :generic_references,
      :source,
      index: true,
      type:  :uuid

    add_index :generic_references, %i[source_id slug], unique: true
    add_index :generic_references, :slug
  end
end
