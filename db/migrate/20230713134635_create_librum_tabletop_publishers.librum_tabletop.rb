# frozen_string_literal: true

# This migration comes from librum_tabletop (originally 20230711141816)
class CreateLibrumTabletopPublishers < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :librum_tabletop_publishers, id: :uuid do |t|
      t.string :name,    null: false, default: ''
      t.string :slug,    null: false, default: ''
      t.string :website, null: false, default: ''

      t.timestamps
    end

    add_index :librum_tabletop_publishers, :name, unique: true
    add_index :librum_tabletop_publishers, :slug, unique: true
  end
end
