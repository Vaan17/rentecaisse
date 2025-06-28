class ListePassagerUtilisateur < ApplicationRecord
  # Relations
  belongs_to :liste_passager
  belongs_to :utilisateur
  
  # Validations
  validates :utilisateur_id, uniqueness: { 
    scope: :liste_passager_id, 
    message: "Un utilisateur ne peut être ajouté qu'une fois par liste" 
  }
  
  # Callbacks pour maintenir l'intégrité - DÉSACTIVÉ temporairement pour éviter les conflits
  # after_destroy :destroy_liste_if_empty
  # Note: La logique a été déplacée dans ListePassagerUtilisateurService
end 