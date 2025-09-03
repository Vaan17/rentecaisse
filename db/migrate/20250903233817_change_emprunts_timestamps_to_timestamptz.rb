class ChangeEmpruntsTimestampsToTimestamptz < ActiveRecord::Migration[7.2]
  def up
    # Changer les colonnes de timestamp without time zone vers timestamp with time zone
    change_column :emprunts, :date_debut, :timestamptz
    change_column :emprunts, :date_fin, :timestamptz
    change_column :emprunts, :created_at, :timestamptz
    change_column :emprunts, :updated_at, :timestamptz
  end

  def down
    # Revenir aux types précédents si nécessaire
    change_column :emprunts, :date_debut, :timestamp
    change_column :emprunts, :date_fin, :timestamp  
    change_column :emprunts, :created_at, :timestamp
    change_column :emprunts, :updated_at, :timestamp
  end
end
