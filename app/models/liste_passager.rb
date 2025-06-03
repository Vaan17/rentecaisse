class ListePassager < ApplicationRecord
  # Associations
  belongs_to :utilisateur
  has_many :emprunts

  # Validations
end 