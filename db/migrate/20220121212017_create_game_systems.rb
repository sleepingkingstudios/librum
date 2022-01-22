# frozen_string_literal: true

class CreateGameSystems < ActiveRecord::Migration[7.0]
  def change
    create_table :game_systems, id: :uuid do |t|
      t.string :name,    null: false, default: ''
      t.string :slug,    null: false, default: ''
      t.string :edition, null: false, default: ''

      t.timestamps
    end

    add_index :game_systems, %i[name edition], unique: true
    add_index :game_systems, :slug, unique: true

    add_reference :game_systems,
      :publisher,
      index: true,
      type:  :uuid
  end
end
