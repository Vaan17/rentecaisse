class ListePassager < ApplicationRecord
  # Associations
  has_many :liste_passager_utilisateurs, dependent: :destroy
  has_many :utilisateurs, through: :liste_passager_utilisateurs
  has_many :emprunts

  # Validations
  validate :au_moins_un_passager, on: [:create, :save], unless: :being_destroyed?
  
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
  
  def retirer_passager(utilisateur_id)
    Rails.logger.info "❌ RETIRER_PASSAGER - Début pour utilisateur ID: #{utilisateur_id}"
    Rails.logger.info "❌ RETIRER_PASSAGER - Relations avant suppression: #{liste_passager_utilisateurs.pluck(:utilisateur_id)}"
    
    transaction do
      relations_supprimees = liste_passager_utilisateurs.where(utilisateur_id: utilisateur_id)
      Rails.logger.info "❌ RETIRER_PASSAGER - Nombre de relations à supprimer: #{relations_supprimees.count}"
      
      resultat = relations_supprimees.destroy_all
      Rails.logger.info "❌ RETIRER_PASSAGER - Résultat destroy_all: #{resultat.inspect}"
      
      # Recharger pour vérifier
      liste_passager_utilisateurs.reload
      Rails.logger.info "❌ RETIRER_PASSAGER - Relations après suppression: #{liste_passager_utilisateurs.pluck(:utilisateur_id)}"
      
      # Si plus aucun passager, détruire la liste directement
      if liste_passager_utilisateurs.empty?
        Rails.logger.info "❌ RETIRER_PASSAGER - Liste vide, destruction directe"
        destroy
        Rails.logger.info "❌ RETIRER_PASSAGER - Liste détruite"
      else
        Rails.logger.info "❌ RETIRER_PASSAGER - Il reste des passagers, conservation de la liste"
      end
    end
  end
  
  def passager_ids
    utilisateurs.pluck(:id)
  end
  
  def noms_passagers
    utilisateurs.pluck(:prenom, :nom).map { |prenom, nom| "#{prenom} #{nom}" }
  end
  
  private
  
  def being_destroyed?
    @being_destroyed || false
  end
  
  def au_moins_un_passager
    if liste_passager_utilisateurs.empty?
      errors.add(:base, "Une liste doit contenir au moins un passager")
    end
  end
end 