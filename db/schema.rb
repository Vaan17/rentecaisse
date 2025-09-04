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

ActiveRecord::Schema[7.2].define(version: 2025_09_03_233817) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "cles", force: :cascade do |t|
    t.string "statut_cle", null: false
    t.bigint "voiture_id", null: false
    t.bigint "utilisateur_id"
    t.bigint "site_id", null: false
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["site_id"], name: "index_cles_on_site_id"
    t.index ["utilisateur_id"], name: "index_cles_on_utilisateur_id"
    t.index ["voiture_id"], name: "index_cles_on_voiture_id"
  end

  create_table "emprunts", force: :cascade do |t|
    t.string "nom_emprunt", null: false
    t.timestamptz "date_debut", null: false
    t.timestamptz "date_fin", null: false
    t.bigint "voiture_id", null: false
    t.bigint "cle_id"
    t.string "statut_emprunt", null: false
    t.bigint "utilisateur_demande_id", null: false
    t.string "description", null: false
    t.bigint "liste_passager_id"
    t.bigint "localisation_id"
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["cle_id"], name: "index_emprunts_on_cle_id"
    t.index ["liste_passager_id"], name: "index_emprunts_on_liste_passager_id"
    t.index ["localisation_id"], name: "index_emprunts_on_localisation_id"
    t.index ["utilisateur_demande_id"], name: "index_emprunts_on_utilisateur_demande_id"
    t.index ["voiture_id"], name: "index_emprunts_on_voiture_id"
  end

  create_table "entreprises", force: :cascade do |t|
    t.string "nom_entreprise", null: false
    t.string "raison_sociale"
    t.string "forme_juridique", null: false
    t.string "numero_siret", null: false
    t.string "adresse", null: false
    t.string "code_postal", null: false
    t.string "ville", null: false
    t.string "pays", null: false
    t.string "telephone", null: false
    t.string "email", null: false
    t.string "site_web", null: false
    t.string "secteur_activite", null: false
    t.integer "effectif", null: false
    t.integer "capital_social", null: false
    t.string "lien_image_entreprise"
    t.string "code_entreprise", null: false
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["numero_siret"], name: "index_entreprises_on_numero_siret", unique: true
    t.check_constraint "capital_social > 0", name: "check_capital_social"
    t.check_constraint "effectif > 0", name: "check_effectif"
    t.check_constraint "email::text ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'::text", name: "check_email"
    t.check_constraint "forme_juridique::text = ANY (ARRAY['SA'::character varying, 'SARL'::character varying, 'SAS'::character varying, 'EURL'::character varying, 'EI'::character varying, 'SC'::character varying, 'SCS'::character varying, 'SNC'::character varying]::text[])", name: "check_forme_juridique"
    t.check_constraint "length(adresse::text) >= 10", name: "check_adresse"
    t.check_constraint "length(code_postal::text) = 5", name: "check_code_postal"
    t.check_constraint "length(numero_siret::text) = ANY (ARRAY[9, 14])", name: "check_numero_siret"
    t.check_constraint "length(pays::text) >= 5", name: "check_pays"
    t.check_constraint "length(ville::text) >= 3", name: "check_ville"
    t.check_constraint "site_web::text ~ '^(https?://)?(www.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*.[a-zA-Z]{2,}(/.*)?$'::text", name: "check_site_web"
  end

  create_table "liste_passager_utilisateurs", force: :cascade do |t|
    t.bigint "liste_passager_id", null: false
    t.bigint "utilisateur_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["liste_passager_id", "utilisateur_id"], name: "index_liste_passager_utilisateur_unique", unique: true
    t.index ["liste_passager_id"], name: "index_liste_passager_utilisateurs_on_liste_passager_id"
    t.index ["utilisateur_id"], name: "index_liste_passager_utilisateurs_on_utilisateur_id"
  end

  create_table "liste_passagers", force: :cascade do |t|
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "localisations", force: :cascade do |t|
    t.string "nom_localisation", null: false
    t.string "adresse", null: false
    t.string "code_postal", null: false
    t.string "ville", null: false
    t.string "pays", null: false
    t.string "telephone"
    t.string "email"
    t.string "site_web"
    t.boolean "added_by_sql"
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "sites", force: :cascade do |t|
    t.string "nom_site", null: false
    t.string "adresse", null: false
    t.string "code_postal", null: false
    t.string "ville", null: false
    t.string "pays", null: false
    t.string "telephone", null: false
    t.string "email", null: false
    t.string "site_web", null: false
    t.string "lien_image_site"
    t.bigint "entreprise_id", null: false
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["entreprise_id"], name: "index_sites_on_entreprise_id"
  end

  create_table "utilisateurs", force: :cascade do |t|
    t.string "email", null: false
    t.string "password", null: false
    t.boolean "admin_entreprise", default: false, null: false
    t.boolean "admin_rentecaisse", default: false, null: false
    t.string "nom"
    t.string "prenom"
    t.date "date_naissance"
    t.string "genre"
    t.string "adresse"
    t.string "code_postal"
    t.string "ville"
    t.string "pays"
    t.string "telephone"
    t.string "categorie_permis"
    t.string "lien_image_utilisateur"
    t.boolean "email_confirme", default: false, null: false
    t.string "confirmation_token"
    t.boolean "premiere_connexion", default: true, null: false
    t.bigint "entreprise_id"
    t.bigint "site_id"
    t.datetime "derniere_connexion"
    t.datetime "token_created_at"
    t.string "reset_password_token"
    t.datetime "reset_password_token_expires_at"
    t.datetime "reset_password_sent_at"
    t.string "session_token"
    t.datetime "session_token_expires_at"
    t.boolean "confirmation_entreprise", default: false
    t.boolean "desactive", default: false
    t.datetime "date_demande_suppression"
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["confirmation_token"], name: "index_utilisateurs_on_confirmation_token", unique: true
    t.index ["email"], name: "index_utilisateurs_on_email", unique: true
    t.index ["entreprise_id"], name: "index_utilisateurs_on_entreprise_id"
    t.index ["site_id"], name: "index_utilisateurs_on_site_id"
  end

  create_table "voitures", force: :cascade do |t|
    t.string "marque", null: false
    t.string "modele", null: false
    t.integer "année_fabrication", null: false
    t.string "immatriculation", null: false
    t.string "carburant", null: false
    t.string "couleur", null: false
    t.integer "puissance", null: false
    t.integer "nombre_portes", null: false
    t.integer "nombre_places", null: false
    t.string "type_boite", null: false
    t.string "statut_voiture", default: "DISPONIBLE", null: false
    t.string "lien_image_voiture"
    t.bigint "entreprise_id", null: false
    t.bigint "site_id", null: false
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["entreprise_id"], name: "index_voitures_on_entreprise_id"
    t.index ["immatriculation"], name: "index_voitures_on_immatriculation", unique: true
    t.index ["site_id"], name: "index_voitures_on_site_id"
  end

  add_foreign_key "cles", "sites"
  add_foreign_key "cles", "utilisateurs"
  add_foreign_key "cles", "voitures"
  add_foreign_key "emprunts", "cles"
  add_foreign_key "emprunts", "liste_passagers"
  add_foreign_key "emprunts", "localisations"
  add_foreign_key "emprunts", "utilisateurs", column: "utilisateur_demande_id"
  add_foreign_key "emprunts", "voitures"
  add_foreign_key "liste_passager_utilisateurs", "liste_passagers"
  add_foreign_key "liste_passager_utilisateurs", "utilisateurs"
  add_foreign_key "sites", "entreprises"
  add_foreign_key "utilisateurs", "entreprises"
  add_foreign_key "utilisateurs", "sites"
  add_foreign_key "voitures", "entreprises"
  add_foreign_key "voitures", "sites"
end
