class EmpruntsUserController < ApplicationController
    before_action :verify_authentication

    def get_emprunts_users
        Rails.logger.info "Début de get_emprunts_users"
        listeEmprunts = Emprunt.all.map do |emprunt|
            Rails.logger.info "Traitement de l'emprunt #{emprunt.id}"
            {
                numero: emprunt.id,
                nom_emprunt: emprunt.nom_emprunt,
                dateDebut: emprunt.date_debut,
                dateFin: emprunt.date_fin,
                vehicule: emprunt.cle&.voiture&.marque || "Véhicule non spécifié",
                vehicule_id: emprunt.cle&.voiture&.id,
                passagers: emprunt.liste_passager.present? ? 1 : 0,
                destination: emprunt.localisation&.nom_localisation || "Destination non spécifiée",
                statut: emprunt.statut_emprunt,
                demandeur: emprunt.utilisateur_demande&.nom || "Utilisateur non spécifié",
                description: emprunt.description
            }
        end

        Rails.logger.info "Nombre d'emprunts trouvés: #{listeEmprunts.size}"
        Rails.logger.info "Emprunts: #{listeEmprunts.inspect}"

        render json: listeEmprunts
    end

    def get_emprunts_user_by_id
        emprunts_user = Emprunt.find(params[:id])

        render json: emprunts_user
    end
    
    def fetch_all
        emprunts = Emprunt.all
    
        render json: emprunts
    end
    
    # Récupérer les emprunts pour une voiture et une période donnée
    def get_emprunts_par_voiture
        voiture_id = params[:voiture_id]
        date_debut = params[:date_debut]
        date_fin = params[:date_fin]
        
        # Vérifier que tous les paramètres sont présents
        if voiture_id.blank? || date_debut.blank? || date_fin.blank?
            return render json: { error: "Paramètres manquants" }, status: :bad_request
        end
        
        # Convertir les dates
        begin
            date_debut = DateTime.parse(date_debut)
            date_fin = DateTime.parse(date_fin)
        rescue ArgumentError
            return render json: { error: "Format de date invalide" }, status: :bad_request
        end
        
        # Rechercher les emprunts pour cette voiture et cette période
        emprunts = Emprunt.where(voiture_id: voiture_id)
                        .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                              date_fin, date_debut, date_debut, date_fin)
                        .includes(:utilisateur_demande) # Inclure les données de l'utilisateur demandeur
        
        # Date actuelle pour vérifier si un emprunt est en cours
        now = DateTime.now
        
        # Transformer les emprunts au format attendu par le front
        emprunts_formattees = emprunts.map do |emprunt|
            status = if emprunt.statut_emprunt == "validé"
                        # Vérifier si l'emprunt est en cours
                        if now >= emprunt.date_debut && now <= emprunt.date_fin
                            "en_cours"
                        else
                            "confirmed" 
                        end
                     elsif emprunt.statut_emprunt == "brouillon"
                        "draft"
                     elsif emprunt.statut_emprunt == "en_attente_validation"
                        "pending_validation"
                     elsif emprunt.statut_emprunt == "completed"
                        "completed"
                     else
                        "empty"
                     end
            
            # Récupérer les informations de l'utilisateur demandeur
            utilisateur = emprunt.utilisateur_demande
            
            {
                id: emprunt.id,
                carId: emprunt.voiture_id,
                startTime: emprunt.date_debut,
                endTime: emprunt.date_fin,
                status: status,
                utilisateur_id: emprunt.utilisateur_demande_id,
                utilisateur_nom: utilisateur&.nom,
                utilisateur_prenom: utilisateur&.prenom,
                nom_emprunt: emprunt.nom_emprunt,
                description: emprunt.description,
                cle_id: emprunt.cle_id,
                liste_passager_id: emprunt.liste_passager_id,
                localisation_id: emprunt.localisation_id
            }
        end
        
        render json: emprunts_formattees
    end
    
    # Récupérer les emprunts pour plusieurs voitures et une période donnée
    def get_emprunts_par_multiple_voitures
        voiture_ids = params[:voiture_ids]
        date_debut = params[:date_debut]
        date_fin = params[:date_fin]
        entreprise_id = @current_user.entreprise_id
        site_id = @current_user.site_id
        
        # Vérifier que tous les paramètres sont présents
        if voiture_ids.blank? || date_debut.blank? || date_fin.blank?
            return render json: { error: "Paramètres manquants" }, status: :bad_request
        end
        
        # Convertir les dates
        begin
            date_debut = DateTime.parse(date_debut)
            date_fin = DateTime.parse(date_fin)
        rescue ArgumentError
            return render json: { error: "Format de date invalide" }, status: :bad_request
        end
        
        # S'assurer que les voitures appartiennent au site et à l'entreprise de l'utilisateur
        voitures = Voiture.where(id: voiture_ids, entreprise_id: entreprise_id, site_id: site_id)
        voiture_ids_filtres = voitures.pluck(:id)
        
        # Requête unique pour toutes les voitures
        emprunts = Emprunt.where(voiture_id: voiture_ids_filtres)
                          .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                date_fin, date_debut, date_debut, date_fin)
                          .includes(:utilisateur_demande)
        
        # Date actuelle pour vérifier si un emprunt est en cours
        now = DateTime.now
        
        # Transformer les emprunts au format attendu par le front
        emprunts_formattees = emprunts.map do |emprunt|
            status = if emprunt.statut_emprunt == "validé"
                        # Vérifier si l'emprunt est en cours
                        if now >= emprunt.date_debut && now <= emprunt.date_fin
                            "en_cours"
                        else
                            "confirmed" 
                        end
                     elsif emprunt.statut_emprunt == "brouillon"
                        "draft"
                     elsif emprunt.statut_emprunt == "en_attente_validation"
                        "pending_validation"
                     elsif emprunt.statut_emprunt == "completed"
                        "completed"
                     else
                        "empty"
                     end
            
            # Récupérer les informations de l'utilisateur demandeur
            utilisateur = emprunt.utilisateur_demande
            
            {
                id: emprunt.id,
                carId: emprunt.voiture_id,
                startTime: emprunt.date_debut,
                endTime: emprunt.date_fin,
                status: status,
                utilisateur_id: emprunt.utilisateur_demande_id,
                utilisateur_nom: utilisateur&.nom,
                utilisateur_prenom: utilisateur&.prenom,
                nom_emprunt: emprunt.nom_emprunt,
                description: emprunt.description,
                cle_id: emprunt.cle_id,
                liste_passager_id: emprunt.liste_passager_id,
                localisation_id: emprunt.localisation_id
            }
        end
        
        render json: emprunts_formattees
    end
    
    # Créer un nouvel emprunt
    def create
        # Valider les paramètres requis
        if params[:voiture_id].blank? || params[:date_debut].blank? || params[:date_fin].blank? ||
                          params[:nom_emprunt].blank? || params[:description].blank?
            return render json: { error: "Paramètres requis manquants" }, status: :bad_request
        end
        
        # Vérifier s'il y a des chevauchements avec d'autres emprunts
        voiture_id = params[:voiture_id]
        date_debut = params[:date_debut]
        date_fin = params[:date_fin]
        
        chevauchements = verifier_chevauchements(voiture_id, date_debut, date_fin)
        
        if chevauchements.any?
            return render json: { 
                error: "Il existe déjà un emprunt pour cette voiture sur ce créneau horaire",
                emprunts_en_conflit: chevauchements.map { |e| e.id }
            }, status: :conflict
        end
        
        # Créer un nouvel emprunt avec le statut "brouillon"
        emprunt = Emprunt.new(
            voiture_id: voiture_id,
            date_debut: date_debut,
            date_fin: date_fin,
            nom_emprunt: params[:nom_emprunt],
            description: params[:description],
            statut_emprunt: "brouillon",
            utilisateur_demande_id: @current_user.id,
            cle_id: params[:cle_id],
            localisation_id: params[:localisation_id],
            created_at: DateTime.now,
            updated_at: DateTime.now
        )
        
        # Créer une liste de passagers si des passagers sont spécifiés
        if params[:passagers].present? && params[:passagers].any?
            # Prendre le premier passager pour créer la liste
            premier_passager_id = params[:passagers].first
            
            liste_passager = ListePassager.create!(
                utilisateur_id: premier_passager_id,
                created_at: DateTime.now,
                updated_at: DateTime.now
            )
            
            # Associer la liste de passagers à l'emprunt
            emprunt.liste_passager_id = liste_passager.id
        end
        
        if emprunt.save
            render json: emprunt, status: :created
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    # Mettre à jour un emprunt existant
    def update
        emprunt = Emprunt.find(params[:id])
        
        # Vérifier que l'utilisateur actuel est bien le créateur de l'emprunt
        if emprunt.utilisateur_demande_id != @current_user.id
            return render json: { error: "Vous n'êtes pas autorisé à modifier cet emprunt" }, status: :forbidden
        end
        
        # Vérifier que l'emprunt est en brouillon
        if emprunt.statut_emprunt != "brouillon"
            return render json: { error: "Seuls les emprunts en brouillon peuvent être modifiés" }, status: :forbidden
        end
        
        # Vérifier s'il y a des chevauchements avec d'autres emprunts
        if params[:date_debut].present? || params[:date_fin].present?
            voiture_id = emprunt.voiture_id
            date_debut = params[:date_debut] || emprunt.date_debut
            date_fin = params[:date_fin] || emprunt.date_fin
            
            chevauchements = verifier_chevauchements(voiture_id, date_debut, date_fin, emprunt.id)
            
            if chevauchements.any?
                return render json: { 
                    error: "Il existe déjà un emprunt pour cette voiture sur ce créneau horaire",
                    emprunts_en_conflit: chevauchements.map { |e| e.id }
                }, status: :conflict
            end
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
        if params[:passagers].present? && params[:passagers].any?
            # Supprimer l'ancienne liste si elle existe
            if emprunt.liste_passager.present?
                emprunt.liste_passager.destroy
            end
            
            # Prendre le premier passager pour créer la nouvelle liste
            premier_passager_id = params[:passagers].first
            
            # Créer une nouvelle liste
            liste_passager = ListePassager.create!(
                utilisateur_id: premier_passager_id,
                created_at: DateTime.now,
                updated_at: DateTime.now
            )
            
            # Associer la nouvelle liste à l'emprunt
            emprunt.liste_passager_id = liste_passager.id
        end
        
        if emprunt.save
            render json: emprunt
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    # Supprimer un emprunt
    def destroy
        emprunt = Emprunt.find(params[:id])
        
        # Vérifier que l'utilisateur actuel est bien le créateur de l'emprunt
        if emprunt.utilisateur_demande_id != @current_user.id
            return render json: { error: "Vous n'êtes pas autorisé à supprimer cet emprunt" }, status: :forbidden
        end
        
        # Vérifier que l'emprunt est en brouillon ou en attente de validation
        unless ["brouillon", "en_attente_validation"].include?(emprunt.statut_emprunt)
            return render json: { error: "Seuls les emprunts en brouillon ou en attente de validation peuvent être supprimés" }, status: :forbidden
        end
        
        # Supprimer l'emprunt
        if emprunt.destroy
            render json: { message: "Emprunt supprimé avec succès" }
        else
            render json: { error: "Impossible de supprimer l'emprunt" }, status: :unprocessable_entity
        end
    end
    
    # Valider un emprunt (pour les administrateurs)
    def valider
        emprunt = Emprunt.find(params[:id])
        current_user = @current_user
        
        # Vérifier que l'utilisateur est un administrateur
        unless current_user.admin_entreprise || current_user.admin_rentecaisse
            return render json: { error: "Vous n'êtes pas autorisé à valider cet emprunt" }, status: :forbidden
        end
        
        # Mettre à jour le statut de l'emprunt
        emprunt.statut_emprunt = "validé"
        emprunt.updated_at = DateTime.now
        
        if emprunt.save
            render json: emprunt
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    # Soumettre un emprunt pour validation
    def soumettre_validation
        emprunt = Emprunt.find(params[:id])
        
        # Vérifier que l'utilisateur actuel est bien le créateur de l'emprunt
        if emprunt.utilisateur_demande_id != @current_user.id
            return render json: { error: "Vous n'êtes pas autorisé à soumettre cet emprunt pour validation" }, status: :forbidden
        end
        
        # Vérifier que l'emprunt est en brouillon
        if emprunt.statut_emprunt != "brouillon"
            return render json: { error: "Seuls les emprunts en brouillon peuvent être soumis pour validation" }, status: :forbidden
        end
        
        # Mettre à jour le statut de l'emprunt
        emprunt.statut_emprunt = "en_attente_validation"
        emprunt.updated_at = DateTime.now
        
        if emprunt.save
            render json: emprunt
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end
    
    private
    
    # Vérifier s'il y a des chevauchements avec d'autres emprunts
    def verifier_chevauchements(voiture_id, date_debut, date_fin, emprunt_id = nil)
        # Convertir les dates si nécessaire
        date_debut = DateTime.parse(date_debut) if date_debut.is_a?(String)
        date_fin = DateTime.parse(date_fin) if date_fin.is_a?(String)
        
        # Rechercher les emprunts qui se chevauchent
        query = Emprunt.where(voiture_id: voiture_id)
                     .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?) OR (date_debut <= ? AND date_fin >= ?)", 
                           date_fin, date_debut, date_debut, date_fin, date_debut, date_debut)
        
        # Exclure l'emprunt en cours de modification s'il est spécifié
        query = query.where.not(id: emprunt_id) if emprunt_id.present?
        
        query
    end
end