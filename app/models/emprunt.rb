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
  def ajouter_passagers(passager_ids)
    return if passager_ids.blank?
    
    transaction do
      # Supprimer l'ancienne liste si elle existe
      if liste_passager.present?
        liste_passager.destroy
      end
      
      # Créer une nouvelle liste avec les passagers
      nouvelle_liste = ListePassager.create_with_passagers(passager_ids)
      update!(liste_passager: nouvelle_liste)
    end
  end
  
  def mettre_a_jour_passagers(nouveaux_passager_ids)
    Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Début avec nouveaux IDs: #{nouveaux_passager_ids}"
    Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Passagers actuels: #{passager_ids}"
    
    return supprimer_tous_passagers if nouveaux_passager_ids.blank?
    
    if liste_passager.present?
      Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Liste existante ID: #{liste_passager.id}"
      
      # Mettre à jour la liste existante
      liste_passager.transaction do
        # Supprimer les passagers qui ne sont plus dans la liste
        passagers_a_retirer = liste_passager.passager_ids - nouveaux_passager_ids
        Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Passagers à retirer: #{passagers_a_retirer}"
        
        passagers_a_retirer.each do |id| 
          Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Retrait du passager ID: #{id}"
          liste_passager.retirer_passager(id) 
        end
        
        # Ajouter les nouveaux passagers
        passagers_a_ajouter = nouveaux_passager_ids - liste_passager.passager_ids
        Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Passagers à ajouter: #{passagers_a_ajouter}"
        
        passagers_a_ajouter.each do |id| 
          Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Ajout du passager ID: #{id}"
          liste_passager.ajouter_passager(id) 
        end
      end
      
      Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Passagers finaux: #{liste_passager.reload.passager_ids}"
    else
      Rails.logger.info "📝 METTRE_A_JOUR_PASSAGERS - Aucune liste existante, création nouvelle"
      ajouter_passagers(nouveaux_passager_ids)
    end
  end
  
  def supprimer_tous_passagers
    Rails.logger.info "🧹 SUPPRIMER_TOUS_PASSAGERS - Début"
    
    if liste_passager.present?
      Rails.logger.info "🧹 SUPPRIMER_TOUS_PASSAGERS - Liste existante ID: #{liste_passager.id}"
      liste_passager.destroy
      self.liste_passager_id = nil
      Rails.logger.info "🧹 SUPPRIMER_TOUS_PASSAGERS - Liste supprimée et référence mise à nil"
    else
      Rails.logger.info "🧹 SUPPRIMER_TOUS_PASSAGERS - Aucune liste à supprimer"
    end
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
    # Récupérer l'ID de la liste avant que l'association soit rompue
    liste_passager_id_to_check = liste_passager_id
    
    if liste_passager_id_to_check.present?
      Rails.logger.info "Nettoyage de la liste de passagers #{liste_passager_id_to_check} pour l'emprunt #{id}"
      
      # Trouver la liste de passagers
      liste_to_check = ListePassager.find_by(id: liste_passager_id_to_check)
      
      if liste_to_check.present?
        # Vérifier si cette liste est utilisée par d'autres emprunts (l'emprunt actuel est déjà supprimé)
        autres_emprunts = Emprunt.where(liste_passager_id: liste_passager_id_to_check)
        
        if autres_emprunts.empty?
          # Cette liste n'est utilisée par aucun emprunt, on peut la supprimer
          Rails.logger.info "Suppression de la liste de passagers #{liste_passager_id_to_check} - plus aucune référence"
          liste_to_check.destroy
        else
          Rails.logger.info "Liste de passagers #{liste_passager_id_to_check} utilisée par #{autres_emprunts.count} autre(s) emprunt(s), conservation"
        end
      else
        Rails.logger.info "Liste de passagers #{liste_passager_id_to_check} déjà supprimée"
      end
    end
  end
end 