class ListePassager < ApplicationRecord
  # Associations
  has_many :liste_passager_utilisateurs, dependent: :destroy
  has_many :utilisateurs, through: :liste_passager_utilisateurs
  has_many :emprunts

  # Note: Plus de validation pour les listes vides car chaque emprunt a sa propre liste
end 