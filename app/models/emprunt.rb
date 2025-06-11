class Emprunt < ApplicationRecord
  # Associations
  belongs_to :voiture
  belongs_to :cle, optional: true
  belongs_to :utilisateur_demande, class_name: 'Utilisateur'
  belongs_to :liste_passager, optional: true
  belongs_to :localisation, optional: true
  has_many :liste_passager_utilisateurs, through: :liste_passager
  has_many :passagers, through: :liste_passager, source: :utilisateurs

  # Validations
  validates :nom_emprunt, presence: true
  validates :date_debut, presence: true
  validates :date_fin, presence: true
  validates :statut_emprunt, presence: true
  validates :description, presence: true

  # Validation personnalisée pour s'assurer que la date de fin est après la date de début
  validate :date_fin_after_date_debut
  # Validation pour vérifier la capacité de la voiture
  validate :capacite_voiture_respectee
  
  # Callbacks pour gérer les listes de passagers
  after_destroy :cleanup_liste_passager

  # Méthodes utiles pour gérer les passagers
  def creer_liste_passager_vide
    # Créer une nouvelle liste vide pour cet emprunt
    nouvelle_liste = ListePassager.new
    # Ne pas sauvegarder immédiatement pour éviter les saves intermédiaires
    self.liste_passager = nouvelle_liste
    Rails.logger.info "📋 CREATION_LISTE - Liste vide créée (sera sauvegardée avec l'emprunt)"
  end
  
  def mettre_a_jour_passagers(nouveaux_passager_ids)
    Rails.logger.info "🔄 UPDATE_PASSAGERS - Début avec nouveaux IDs: #{nouveaux_passager_ids}"
    Rails.logger.info "🔄 UPDATE_PASSAGERS - Passagers actuels: #{passager_ids}"
    
    # S'assurer qu'une liste existe
    creer_liste_passager_vide unless liste_passager.present?
    
    # Pour une nouvelle liste, elle doit être sauvegardée avant d'ajouter des relations
    if liste_passager.new_record?
      liste_passager.save!(validate: false)
      Rails.logger.info "🔄 UPDATE_PASSAGERS - Nouvelle liste sauvegardée ID: #{liste_passager.id}"
    end
    
    # Supprimer toutes les relations existantes
    if liste_passager.liste_passager_utilisateurs.any?
      Rails.logger.info "🗑️ UPDATE_PASSAGERS - Suppression de toutes les relations existantes"
      liste_passager.liste_passager_utilisateurs.destroy_all
    end
    
    # Ajouter les nouvelles relations
    if nouveaux_passager_ids.present?
      Rails.logger.info "➕ UPDATE_PASSAGERS - Ajout des nouvelles relations: #{nouveaux_passager_ids}"
      nouveaux_passager_ids.each do |passager_id|
        liste_passager.liste_passager_utilisateurs.create!(utilisateur_id: passager_id)
      end
    end
    
    Rails.logger.info "✅ UPDATE_PASSAGERS - Passagers finaux: #{liste_passager.passager_ids}"
  end
  
  def noms_passagers
    liste_passager&.noms_passagers || []
  end
  
  def passager_ids
    liste_passager&.passager_ids || []
  end
  
  def nombre_passagers
    passager_ids.count
  end
  
  def nombre_total_occupants
    # Conducteur + passagers
    1 + nombre_passagers
  end

  private

  def date_fin_after_date_debut
    return if date_debut.blank? || date_fin.blank?

    if date_fin <= date_debut
      errors.add(:date_fin, "doit être postérieure à la date de début")
    end
  end
  
  def capacite_voiture_respectee
    return unless voiture_id.present?
    
    voiture_obj = voiture || Voiture.find_by(id: voiture_id)
    return unless voiture_obj.present?
    
         if nombre_total_occupants > voiture_obj.nombre_places
       errors.add(:base, "Le nombre total d'occupants (#{nombre_total_occupants}) dépasse la capacité du véhicule (#{voiture_obj.nombre_places} places)")
     end
  end
  
  # Nettoyer la liste de passagers après suppression de l'emprunt
  def cleanup_liste_passager
    if liste_passager.present?
      Rails.logger.info "🧹 CLEANUP - Suppression de la liste de passagers #{liste_passager.id} pour l'emprunt #{id}"
      liste_passager.destroy # Suppression en cascade des relations
      Rails.logger.info "🧹 CLEANUP - Liste de passagers supprimée"
    end
  end
end 