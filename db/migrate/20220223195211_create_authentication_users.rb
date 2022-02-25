# frozen_string_literal: true

class CreateAuthenticationUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :authentication_users, id: :uuid do |t|
      t.string :username, null: false, default: ''
      t.string :email,    null: false, default: ''

      t.timestamps
    end

    add_index :authentication_users, :email,    unique: true
    add_index :authentication_users, :username, unique: true
  end
end
