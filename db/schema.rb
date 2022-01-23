# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_01_22_213128) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "game_systems", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", default: "", null: false
    t.string "slug", default: "", null: false
    t.string "edition", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "publisher_id"
    t.index ["name", "edition"], name: "index_game_systems_on_name_and_edition", unique: true
    t.index ["publisher_id"], name: "index_game_systems_on_publisher_id"
    t.index ["slug"], name: "index_game_systems_on_slug", unique: true
  end

  create_table "publishers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", default: "", null: false
    t.string "slug", default: "", null: false
    t.string "website", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_publishers_on_name", unique: true
    t.index ["slug"], name: "index_publishers_on_slug", unique: true
  end

  create_table "sources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "type", null: false
    t.jsonb "data", default: {}, null: false
    t.string "name", default: "", null: false
    t.string "slug", default: "", null: false
    t.string "shortcode", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "game_system_id"
    t.uuid "publisher_id"
    t.index ["game_system_id"], name: "index_sources_on_game_system_id"
    t.index ["name"], name: "index_sources_on_name", unique: true
    t.index ["publisher_id"], name: "index_sources_on_publisher_id"
    t.index ["shortcode"], name: "index_sources_on_shortcode", unique: true
    t.index ["slug"], name: "index_sources_on_slug", unique: true
  end

end
