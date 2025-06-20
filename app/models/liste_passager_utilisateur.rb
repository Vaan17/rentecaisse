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
  
  private
  
  def destroy_liste_if_empty
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Callback pour relation ID: #{self.id}"
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - ListePassager ID: #{liste_passager.id}"
    
    # Vérifier s'il reste des passagers après cette suppression
    remaining_count = liste_passager.liste_passager_utilisateurs.where.not(id: self.id).count
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Nombre de relations restantes: #{remaining_count}"
    
    if remaining_count == 0
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Aucune relation restante, destruction de la liste"
      # Destruction directe de la liste
      liste_passager.destroy
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Liste détruite"
    else
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Des relations restent, conservation de la liste"
    end
  end
end 