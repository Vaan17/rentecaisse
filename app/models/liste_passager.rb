class ListePassager < ApplicationRecord
  # Associations
  belongs_to :utilisateur
  has_many :emprunts

  # Validations
  validates :date_creation_liste, presence: true
  validates :date_modification_liste, presence: true
end 