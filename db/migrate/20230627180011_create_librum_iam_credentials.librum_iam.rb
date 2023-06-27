# frozen_string_literal: true

# This migration comes from librum_iam (originally 20230627165229)
class CreateLibrumIamCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :librum_iam_credentials, id: :uuid do |t|
      t.string     :type,       null: false
      t.boolean    :active,     null: false, default: true
      t.jsonb      :data,       null: false, default: {}
      t.timestamp  :expires_at, null: false

      t.timestamps
    end

    add_reference :librum_iam_credentials,
      :user,
      foreign_key: { to_table: :librum_iam_users },
      type:        :uuid
    add_index     :librum_iam_credentials, %i[user_id type]
  end
end
