class Cle < ApplicationRecord
  # Associations
  belongs_to :voiture
  belongs_to :utilisateur, optional: true
  belongs_to :site
  has_many :emprunts

  # Validations
  validates :statut_cle, presence: true
end 