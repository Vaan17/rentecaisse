class AddConfirmationEntrepriseToUtilisateurs < ActiveRecord::Migration[7.2]
  def change
    add_column :utilisateurs, :confirmation_entreprise, :boolean, default: false
    
    # Mettre à jour les enregistrements existants
    Utilisateur.update_all(confirmation_entreprise: false)
  end
end
