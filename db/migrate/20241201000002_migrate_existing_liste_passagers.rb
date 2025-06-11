class MigrateExistingListePassagers < ActiveRecord::Migration[7.0]
  def up
    # Migrer les données existantes de liste_passagers vers la table de jointure
    execute <<-SQL
      INSERT INTO liste_passager_utilisateurs (liste_passager_id, utilisateur_id, created_at, updated_at)
      SELECT id, utilisateur_id, created_at, updated_at 
      FROM liste_passagers 
      WHERE utilisateur_id IS NOT NULL;
    SQL
  end
  
  def down
    # Supprimer toutes les données de la table de jointure
    ListePassagerUtilisateur.delete_all
  end
end 