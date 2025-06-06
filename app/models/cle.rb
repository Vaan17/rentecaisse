class Cle < ApplicationRecord
  # Associations
  belongs_to :voiture
  belongs_to :utilisateur, optional: true
  belongs_to :site
  has_many :emprunts

  # Validations
  validates :statut_cle, presence: true

  def to_format
    {
      id:,
      statut_cle:,
      utilisateur_id:,
      voiture_id:,
      site_id:,
      updated_at:
    }
  end
end
