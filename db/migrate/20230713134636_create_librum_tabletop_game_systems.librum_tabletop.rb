# frozen_string_literal: true

# This migration comes from librum_tabletop (originally 20230711143407)
class CreateLibrumTabletopGameSystems < ActiveRecord::Migration[7.0]
  def change
    create_table :librum_tabletop_game_systems, id: :uuid do |t|
      t.string :name,    null: false, default: ''
      t.string :slug,    null: false, default: ''
      t.string :edition, null: false, default: ''

      t.timestamps
    end

    add_index :librum_tabletop_game_systems, %i[name edition], unique: true
    add_index :librum_tabletop_game_systems, :slug, unique: true

    add_reference :librum_tabletop_game_systems,
      :publisher,
      index: true,
      type:  :uuid
  end
end
