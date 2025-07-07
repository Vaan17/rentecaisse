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
  # Validation pour s'assurer que la voiture a des clés configurées
  validate :voiture_has_keys, on: :create
  
  # Callbacks - utilise le service pour la logique
  after_destroy :cleanup_liste_passager_callback

  private

  def to_format
    {
      id:,
      statut_emprunt:,
      nom_emprunt:,
      description:,
      date_debut:,
      date_fin:,
      utilisateur_demande_id:,
      liste_passager_id:,
      voiture_id:,
      cle_id:,
      localisation_id:,
      updated_at:
    }
  end

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

    # Utiliser le service pour calculer le nombre d'occupants
    nombre_total_occupants = EmpruntService.nombre_total_occupants(self)

    if nombre_total_occupants > voiture_obj.nombre_places
      errors.add(:base, "Le nombre total d'occupants (#{nombre_total_occupants}) dépasse la capacité du véhicule (#{voiture_obj.nombre_places} places)")
    end
  end

  def voiture_has_keys
    return unless voiture_id.present?

    # Vérifier via le service qu'il existe au moins une clé "Principale" ou "Double" pour cette voiture
    unless EmpruntService.car_has_keys?(voiture_id)
      errors.add(:base, "Cette voiture n'a aucune clé principale ou double configurée. L'administrateur doit créer au moins une clé avant de pouvoir créer des emprunts.")
    end
  end

  # Callback qui délègue au service
  def cleanup_liste_passager_callback
    EmpruntService.cleanup_liste_passager(self)
  end
end
