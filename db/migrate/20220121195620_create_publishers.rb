# frozen_string_literal: true

class CreatePublishers < ActiveRecord::Migration[7.0]
  def change
    create_table :publishers, id: :uuid do |t|
      t.string :name,    null: false, default: ''
      t.string :slug,    null: false, default: ''
      t.string :website, null: false, default: ''

      t.timestamps
    end

    add_index :publishers, :name, unique: true
    add_index :publishers, :slug, unique: true
  end
end
