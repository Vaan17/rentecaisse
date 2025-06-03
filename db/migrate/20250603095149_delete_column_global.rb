class DeleteColumnGlobal < ActiveRecord::Migration[7.2]
  def change
    remove_column :cles, :date_creation_cle
    remove_column :cles, :date_modification_cle
    add_timestamps :cles, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :emprunts, :date_creation_emprunt
    remove_column :emprunts, :date_modification_emprunt
    add_timestamps :emprunts, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :entreprises, :date_creation_entreprise
    remove_column :entreprises, :date_modification_entreprise
    add_timestamps :entreprises, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :liste_passagers, :date_creation_liste
    remove_column :liste_passagers, :date_modification_liste
    add_timestamps :liste_passagers, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :localisations, :date_creation_localisation
    remove_column :localisations, :date_modification_localisation
    add_timestamps :localisations, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :sites, :date_creation_site
    remove_column :sites, :date_modification_site
    add_timestamps :sites, default: -> { 'CURRENT_TIMESTAMP' }, null: false

    remove_column :utilisateurs, :date_creation_utilisateur
    remove_column :utilisateurs, :date_modification_utilisateur
    add_timestamps :utilisateurs, default: -> { 'CURRENT_TIMESTAMP' }, null: false
  end
end
