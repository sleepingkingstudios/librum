# frozen_string_literal: true

class CreateGameSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :game_settings, id: :uuid do |t|
      t.string :name, null: false, default: ''
      t.string :slug, null: false, default: ''

      t.timestamps
    end

    add_reference :game_settings,
      :publisher,
      index: true,
      type:  :uuid

    add_reference :sources,
      :game_setting,
      index: true,
      type:  :uuid

    add_index :game_settings, %i[name], unique: true
    add_index :game_settings, %i[slug], unique: true
  end
end
