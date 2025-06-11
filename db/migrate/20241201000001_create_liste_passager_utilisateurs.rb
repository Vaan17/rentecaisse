class CreateListePassagerUtilisateurs < ActiveRecord::Migration[7.0]
  def change
    create_table :liste_passager_utilisateurs do |t|
      t.references :liste_passager, null: false, foreign_key: true
      t.references :utilisateur, null: false, foreign_key: true
      t.timestamps
    end
    
    # Index pour éviter les doublons et optimiser les requêtes
    add_index :liste_passager_utilisateurs, [:liste_passager_id, :utilisateur_id], 
              unique: true, name: 'index_liste_passager_utilisateur_unique'
  end
end 