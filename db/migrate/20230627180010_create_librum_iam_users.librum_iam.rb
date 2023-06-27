# frozen_string_literal: true

# This migration comes from librum_iam (originally 20230627040748)
class CreateLibrumIamUsers < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :librum_iam_users, id: :uuid do |t|
      t.string :username, null: false, default: ''
      t.string :email,    null: false, default: ''
      t.string :slug,     null: false, default: ''
      t.string :role,     null: false, default: ''

      t.timestamps
    end

    add_index :librum_iam_users, :email,    unique: true
    add_index :librum_iam_users, :slug,     unique: true
    add_index :librum_iam_users, :username, unique: true
  end
end
