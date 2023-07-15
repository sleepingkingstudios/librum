# frozen_string_literal: true

# This migration comes from librum_tabletop (originally 20230711144620)
class CreateLibrumTabletopGameSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :librum_tabletop_game_settings, id: :uuid do |t|
      t.string :name, null: false, default: ''
      t.string :slug, null: false, default: ''

      t.timestamps
    end

    add_reference :librum_tabletop_game_settings,
      :publisher,
      index: true,
      type:  :uuid

    add_index :librum_tabletop_game_settings, %i[name], unique: true
    add_index :librum_tabletop_game_settings, %i[slug], unique: true
  end
end
