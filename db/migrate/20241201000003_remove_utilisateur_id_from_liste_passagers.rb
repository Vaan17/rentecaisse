class RemoveUtilisateurIdFromListePassagers < ActiveRecord::Migration[7.0]
  def up
    remove_column :liste_passagers, :utilisateur_id
  end
  
  def down
    add_reference :liste_passagers, :utilisateur, foreign_key: true
    
    # Restaurer les données (prendre le premier utilisateur de chaque liste)
    execute <<-SQL
      UPDATE liste_passagers 
      SET utilisateur_id = (
        SELECT utilisateur_id 
        FROM liste_passager_utilisateurs 
        WHERE liste_passager_utilisateurs.liste_passager_id = liste_passagers.id 
        LIMIT 1
      );
    SQL
  end
end 