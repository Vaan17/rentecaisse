class EmpruntService
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
        date_creation_emprunt: DateTime.now,
        date_modification_emprunt: DateTime.now
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
      emprunt.date_modification_emprunt = DateTime.now
      
      # Mettre à jour la liste des passagers si nécessaire
      if params[:passagers].present?
        # Supprimer l'ancienne liste si elle existe
        if emprunt.liste_passager.present?
          supprimer_liste_passagers(emprunt.liste_passager_id)
        end
        
        # Créer une nouvelle liste
        liste_passager = creer_liste_passagers(utilisateur_id, params[:passagers])
        emprunt.liste_passager_id = liste_passager.id
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
    emprunt.date_modification_emprunt = DateTime.now
    emprunt.save!
    emprunt
  rescue ActiveRecord::RecordInvalid => e
    raise e
  end
  
  private
  
  # Crée une liste de passagers
  def self.creer_liste_passagers(utilisateur_id, passagers)
    liste_passager = ListePassager.create!(
      utilisateur_id: utilisateur_id,
      date_creation_liste: DateTime.now,
      date_modification_liste: DateTime.now
    )
    
    # Associer les passagers à la liste
    passagers.each do |passager_id|
      ListePassagerUtilisateur.create!(
        liste_passager_id: liste_passager.id,
        utilisateur_id: passager_id
      )
    end
    
    liste_passager
  end
  
  # Supprime une liste de passagers et ses associations
  def self.supprimer_liste_passagers(liste_passager_id)
    ListePassagerUtilisateur.where(liste_passager_id: liste_passager_id).destroy_all
    ListePassager.find(liste_passager_id).destroy
  end
end 