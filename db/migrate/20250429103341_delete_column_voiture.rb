class DeleteColumnVoiture < ActiveRecord::Migration[7.2]
  def change
    remove_column :voitures, :date_creation_voiture
    remove_column :voitures, :date_modification_voiture

    add_timestamps :voitures, default: -> { 'CURRENT_TIMESTAMP' }, null: false
  end
end
