class ListePassagerUtilisateurService
  # Vérifie et supprime la liste si elle est vide après suppression d'une relation
  def self.destroy_liste_if_empty(liste_passager_utilisateur)
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Service pour relation ID: #{liste_passager_utilisateur.id}"
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - ListePassager ID: #{liste_passager_utilisateur.liste_passager.id}"
    
    # Vérifier s'il reste des passagers après cette suppression
    remaining_count = liste_passager_utilisateur.liste_passager.liste_passager_utilisateurs
                                                .where.not(id: liste_passager_utilisateur.id).count
    Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Nombre de relations restantes: #{remaining_count}"
    
    if remaining_count == 0
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Aucune relation restante, destruction de la liste"
      # Destruction directe de la liste
      liste_passager_utilisateur.liste_passager.destroy
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Liste détruite"
    else
      Rails.logger.info "🗑️ DESTROY_LISTE_IF_EMPTY - Des relations restent, conservation de la liste"
    end
  end
  
  # Crée une relation entre une liste et un utilisateur
  def self.create_relation(liste_passager_id, utilisateur_id)
    ListePassagerUtilisateur.create!(
      liste_passager_id: liste_passager_id,
      utilisateur_id: utilisateur_id
    )
  end
  
  # Supprime toutes les relations pour une liste donnée
  def self.delete_all_for_liste(liste_passager_id)
    ListePassagerUtilisateur.where(liste_passager_id: liste_passager_id).destroy_all
  end
end
