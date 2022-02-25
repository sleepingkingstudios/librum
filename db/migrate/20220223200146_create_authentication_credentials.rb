# frozen_string_literal: true

class CreateAuthenticationCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :authentication_credentials, id: :uuid do |t|
      t.string    :type,       null: false
      t.boolean   :active,     null: false, default: true
      t.jsonb     :data,       null: false, default: {}
      t.timestamp :expires_at, null: false
      t.uuid      :user_id

      t.timestamps
    end

    add_index :authentication_credentials, %i[user_id type]
  end
end
