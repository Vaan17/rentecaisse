class EmpruntService
  # Vérifie si une voiture a des clés configurées
  def self.car_has_keys?(voiture_id)
    Cle.where(voiture_id: voiture_id, statut_cle: ['Principale', 'Double']).exists?
  end
  
  # Trouve la clé principale pour une voiture
  def self.find_primary_key_for_car(voiture_id)
    # 1. Chercher d'abord une clé "Principale"
    primary_key = Cle.where(voiture_id: voiture_id, statut_cle: 'Principale').first
    return primary_key if primary_key
    
    # 2. Si pas de clé principale, chercher une clé "Double"
    double_key = Cle.where(voiture_id: voiture_id, statut_cle: 'Double').first
    return double_key if double_key
    
    # 3. Si aucune clé avec les statuts attendus, retourner nil
    nil
  end
  
  # Assigne automatiquement une clé principale à un emprunt
  def self.assign_primary_key(emprunt)
    return if emprunt.cle_id.present? # Ne pas réassigner si déjà présent
    
    primary_key = find_primary_key_for_car(emprunt.voiture_id)
    if primary_key
      emprunt.cle_id = primary_key.id
      Rails.logger.info "🔑 AUTO-ASSIGN - Clé #{primary_key.id} (#{primary_key.statut_cle}) assignée à l'emprunt"
    else
      emprunt.errors.add(:base, "Aucune clé principale ou double n'est disponible pour cette voiture. Contactez l'administrateur.")
      Rails.logger.error "❌ AUTO-ASSIGN - Aucune clé appropriée trouvée pour la voiture #{emprunt.voiture_id}"
    end
  end
  
  # Crée une liste de passagers vide pour un emprunt
  def self.creer_liste_passager_vide(emprunt)
    # Créer une nouvelle liste vide pour cet emprunt
    nouvelle_liste = ListePassager.new
    # Ne pas sauvegarder immédiatement pour éviter les saves intermédiaires
    emprunt.liste_passager = nouvelle_liste
    Rails.logger.info "📋 CREATION_LISTE - Liste vide créée (sera sauvegardée avec l'emprunt)"
  end
  
  # Met à jour les passagers d'un emprunt
  def self.mettre_a_jour_passagers(emprunt, nouveaux_passager_ids)
    Rails.logger.info "🔄 UPDATE_PASSAGERS - Début avec nouveaux IDs: #{nouveaux_passager_ids}"
    Rails.logger.info "🔄 UPDATE_PASSAGERS - Passagers actuels: #{passager_ids(emprunt)}"
    
    # S'assurer qu'une liste existe
    creer_liste_passager_vide(emprunt) unless emprunt.liste_passager.present?
    
    # Pour une nouvelle liste, elle doit être sauvegardée avant d'ajouter des relations
    if emprunt.liste_passager.new_record?
      emprunt.liste_passager.save!(validate: false)
      Rails.logger.info "🔄 UPDATE_PASSAGERS - Nouvelle liste sauvegardée ID: #{emprunt.liste_passager.id}"
    end
    
    # Supprimer toutes les relations existantes
    if emprunt.liste_passager.liste_passager_utilisateurs.any?
      Rails.logger.info "🗑️ UPDATE_PASSAGERS - Suppression de toutes les relations existantes"
      ListePassagerUtilisateurService.delete_all_for_liste(emprunt.liste_passager.id)
    end
    
    # Ajouter les nouvelles relations
    if nouveaux_passager_ids.present?
      Rails.logger.info "➕ UPDATE_PASSAGERS - Ajout des nouvelles relations: #{nouveaux_passager_ids}"
      nouveaux_passager_ids.each do |passager_id|
        ListePassagerUtilisateurService.create_relation(emprunt.liste_passager.id, passager_id)
      end
    end
    
    Rails.logger.info "✅ UPDATE_PASSAGERS - Passagers finaux: #{ListePassagerService.passager_ids(emprunt.liste_passager)}"
  end
  
  # Nettoie la liste de passagers après suppression d'un emprunt
  def self.cleanup_liste_passager(emprunt)
    if emprunt.liste_passager.present?
      Rails.logger.info "🧹 CLEANUP - Suppression de la liste de passagers #{emprunt.liste_passager.id} pour l'emprunt #{emprunt.id}"
      ListePassagerService.supprimer_liste_passagers(emprunt.liste_passager.id)
      Rails.logger.info "🧹 CLEANUP - Liste de passagers supprimée"
    end
  end
  
  # Méthodes d'affichage (peuvent rester comme méthodes de service)
  def self.noms_passagers(emprunt)
    emprunt.liste_passager ? ListePassagerService.noms_passagers(emprunt.liste_passager) : []
  end
  
  def self.passager_ids(emprunt)
    emprunt.liste_passager ? ListePassagerService.passager_ids(emprunt.liste_passager) : []
  end
  
  def self.nombre_passagers(emprunt)
    passager_ids(emprunt).count
  end
  
  def self.nombre_total_occupants(emprunt)
    # Conducteur + passagers
    1 + nombre_passagers(emprunt)
  end
  
  # Récupère les emprunts pour une voiture et une période donnée
  def self.emprunts_par_voiture_et_periode(voiture_id, date_debut, date_fin)
    Emprunt.where(voiture_id: voiture_id)
          .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                date_fin, date_debut, date_debut, date_fin)
  end
  
  # Vérifie si un créneau est disponible pour une voiture
  def self.creneau_disponible?(voiture_id, date_debut, date_fin)
    emprunts = emprunts_par_voiture_et_periode(voiture_id, date_debut, date_fin)
    emprunts.empty?
  end
  
  # Crée un nouvel emprunt
  def self.creer_emprunt(params, utilisateur_id)
    ActiveRecord::Base.transaction do
      # Créer l'emprunt
      emprunt = Emprunt.new(
        voiture_id: params[:voiture_id],
        date_debut: params[:date_debut],
        date_fin: params[:date_fin],
        nom_emprunt: params[:nom_emprunt],
        description: params[:description],
        statut_emprunt: "brouillon",
        utilisateur_demande_id: utilisateur_id,
        cle_id: params[:cle_id],
        localisation_id: params[:localisation_id],
        created_at: DateTime.now,
        updated_at: DateTime.now
      )
      
      # Créer la liste de passagers si nécessaire
      if params[:passagers].present? && params[:passagers].any?
        liste_passager = creer_liste_passagers(utilisateur_id, params[:passagers])
        emprunt.liste_passager_id = liste_passager.id
      end
      
      emprunt.save!
      emprunt
    end
  rescue ActiveRecord::RecordInvalid => e
    raise e
  end
  
  # Met à jour un emprunt existant
  def self.mettre_a_jour_emprunt(emprunt, params, utilisateur_id)
    ActiveRecord::Base.transaction do
      # Si l'emprunt était validé, le repasser en brouillon
      if emprunt.statut_emprunt == "validé"
        emprunt.statut_emprunt = "brouillon"
      end
      
      # Mettre à jour les champs de l'emprunt
      emprunt.date_debut = params[:date_debut] if params[:date_debut].present?
      emprunt.date_fin = params[:date_fin] if params[:date_fin].present?
      emprunt.nom_emprunt = params[:nom_emprunt] if params[:nom_emprunt].present?
      emprunt.description = params[:description] if params[:description].present?
      emprunt.cle_id = params[:cle_id] if params[:cle_id].present?
      emprunt.localisation_id = params[:localisation_id] if params[:localisation_id].present?
      emprunt.updated_at = DateTime.now
      
      # Mettre à jour la liste des passagers si nécessaire
      if params[:passagers].present?
        # Utiliser la nouvelle approche via le service
        mettre_a_jour_passagers(emprunt, params[:passagers])
      end
      
      emprunt.save!
      emprunt
    end
  rescue ActiveRecord::RecordInvalid => e
    raise e
  end
  
  # Valide un emprunt
  def self.valider_emprunt(emprunt)
    emprunt.statut_emprunt = "validé"
    emprunt.updated_at = DateTime.now
    emprunt.save!
    emprunt
  rescue ActiveRecord::RecordInvalid => e
    raise e
  end
  
  private
  
  # Crée une liste de passagers (méthode modifiée pour utiliser les services)
  def self.creer_liste_passagers(utilisateur_id, passagers)
    liste_passager = ListePassager.create!(
      created_at: DateTime.now,
      updated_at: DateTime.now
    )
    
    # Associer les passagers à la liste via le service
    passagers.each do |passager_id|
      ListePassagerUtilisateurService.create_relation(liste_passager.id, passager_id)
    end
    
    liste_passager
  end
end 