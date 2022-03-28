# frozen_string_literal: true

class UpdateSourceUniqueIndices < ActiveRecord::Migration[7.0]
  def change
    remove_index :sources, :name
    remove_index :sources, :slug

    add_index :sources, %i[name game_system_id publisher_id], unique: true
    add_index :sources, %i[slug game_system_id], unique: true
  end
end
