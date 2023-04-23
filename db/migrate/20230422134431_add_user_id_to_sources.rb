# frozen_string_literal: true

class AddUserIdToSources < ActiveRecord::Migration[7.0]
  def change
    add_reference :sources,
      :user,
      index: true,
      type:  :uuid
  end
end
