class Emprunt < ApplicationRecord
  # Associations
  belongs_to :voiture
  belongs_to :cle, optional: true
  belongs_to :utilisateur_demande, class_name: 'Utilisateur'
  belongs_to :liste_passager, optional: true
  belongs_to :localisation, optional: true

  # Validations
  validates :nom_emprunt, presence: true
  validates :date_debut, presence: true
  validates :date_fin, presence: true
  validates :statut_emprunt, presence: true
  validates :description, presence: true
  validates :date_creation_emprunt, presence: true
  validates :date_modification_emprunt, presence: true

  # Validation personnalisée pour s'assurer que la date de fin est après la date de début
  validate :date_fin_after_date_debut

  private

  def date_fin_after_date_debut
    return if date_debut.blank? || date_fin.blank?

    if date_fin <= date_debut
      errors.add(:date_fin, "doit être postérieure à la date de début")
    end
  end
end 