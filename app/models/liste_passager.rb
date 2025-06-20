class ListePassager < ApplicationRecord
  # Associations
  has_many :liste_passager_utilisateurs, dependent: :destroy
  has_many :utilisateurs, through: :liste_passager_utilisateurs
  has_many :emprunts

  # Note: Plus de validation pour les listes vides car chaque emprunt a sa propre liste
  
  # Méthodes utiles
  def self.create_with_passagers(passager_ids)
    return nil if passager_ids.blank?
    
    transaction do
      # Créer sans validation d'abord
      liste = new
      liste.save!(validate: false)
      
      # Ajouter les passagers
      passager_ids.each do |passager_id|
        liste.liste_passager_utilisateurs.create!(utilisateur_id: passager_id)
      end
      
      # Maintenant valider avec les passagers en place
      liste.reload
      liste.save! if liste.changed?
      
      liste
    end
  end
  
  def ajouter_passager(utilisateur_id)
    liste_passager_utilisateurs.find_or_create_by(utilisateur_id: utilisateur_id)
  end
  
  def passager_ids
    utilisateurs.pluck(:id)
  end
  
  def noms_passagers
    utilisateurs.pluck(:prenom, :nom).map { |prenom, nom| "#{prenom} #{nom}" }
  end
end 