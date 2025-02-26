class AddLastConnectionFieldsToUtilisateurs < ActiveRecord::Migration[7.2]
  def change
    add_column :utilisateurs, :derniere_connexion, :datetime
    add_column :utilisateurs, :token_created_at, :datetime
  end
end
