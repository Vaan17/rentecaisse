class AddDeletionFieldsToUtilisateurs < ActiveRecord::Migration[7.2]
  def change
    add_column :utilisateurs, :desactive, :boolean, default: false
    add_column :utilisateurs, :date_demande_suppression, :datetime
  end
end
