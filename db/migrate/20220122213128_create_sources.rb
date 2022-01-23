# frozen_string_literal: true

class CreateSources < ActiveRecord::Migration[7.0]
  def change
    create_table :sources, id: :uuid do |t|
      t.string :type,      null: false
      t.jsonb  :data,      null: false, default: {}
      t.string :name,      null: false, default: ''
      t.string :slug,      null: false, default: ''
      t.string :shortcode, null: false, default: ''

      t.timestamps
    end

    add_index :sources, :name,      unique: true
    add_index :sources, :slug,      unique: true
    add_index :sources, :shortcode, unique: true

    add_reference :sources,
      :game_system,
      index: true,
      type:  :uuid

    add_reference :sources,
      :publisher,
      index: true,
      type:  :uuid
  end
end
