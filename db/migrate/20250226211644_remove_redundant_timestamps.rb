class RemoveRedundantTimestamps < ActiveRecord::Migration[7.1]
  def change
    # Suppression des timestamps de la table entreprises
    remove_column :entreprises, :created_at
    remove_column :entreprises, :updated_at

    # Suppression des timestamps de la table sites
    remove_column :sites, :created_at
    remove_column :sites, :updated_at

    # Suppression des timestamps de la table utilisateurs
    remove_column :utilisateurs, :created_at
    remove_column :utilisateurs, :updated_at

    # Suppression des timestamps de la table voitures
    remove_column :voitures, :created_at
    remove_column :voitures, :updated_at

    # Suppression des timestamps de la table cles
    remove_column :cles, :created_at
    remove_column :cles, :updated_at

    # Suppression des timestamps de la table liste_passagers
    remove_column :liste_passagers, :created_at
    remove_column :liste_passagers, :updated_at

    # Suppression des timestamps de la table localisations
    remove_column :localisations, :created_at
    remove_column :localisations, :updated_at

    # Suppression des timestamps de la table emprunts
    remove_column :emprunts, :created_at
    remove_column :emprunts, :updated_at
  end
end
