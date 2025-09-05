class EmpruntsController < ApplicationController
    before_action :verify_authentication

    def fetch_all
        # get all users from the same entreprise
        entrepriseUsers = Utilisateur.all.where(entreprise_id: @current_user.entreprise_id)
        userIds = entrepriseUsers.map do |user|
            user.id
        end

        # get all emprunts from all users with the same entreprise
        emprunts = Emprunt.all.where(utilisateur_demande_id: userIds)
        emprunts = emprunts.map do |emprunt|
            emprunt.to_format
        end

        render json: emprunts
    end

    def get_emprunts_user_by_id
        emprunts_user = Emprunt.find(params[:id])

        render json: emprunts_user
    end
    
    # Récupère les emprunts de l'utilisateur connecté (en tant que conducteur ou passager)
    def fetch_emprunts_utilisateur
        emprunts = EmpruntService.emprunts_pour_utilisateur(@current_user.id)
        emprunts_formattees = emprunts.map do |emprunt|
            # Utiliser to_format comme base
            emprunt_data = emprunt.to_format
            
            # Ajouter les informations des passagers si présentes
            if emprunt.liste_passager.present?
                passagers_info = emprunt.liste_passager.utilisateurs.map do |passager|
                    {
                        id: passager.id,
                        nom: passager.nom,
                        prenom: passager.prenom,
                        email: passager.email
                    }
                end
                emprunt_data[:passagers] = passagers_info
            else
                emprunt_data[:passagers] = []
            end
            
            emprunt_data
        end
        
        render json: emprunts_formattees
    end

    # def update
    #     params["data"].permit!

    #     attributes = params["data"].to_h

    #     Emprunt.find(attributes["id"]).update(attributes)
    #     updatedEmprunt = Emprunt.find(attributes["id"])

    #     render json: updatedEmprunt.to_format
    # end

    def delete
        Emprunt.find(params["id"]).delete

        render json: { "id" => params["id"] }
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
        
        # Convertir les dates en gardant le fuseau horaire local
        begin
            date_debut = Time.zone.parse(date_debut)
            date_fin = Time.zone.parse(date_fin)
        rescue ArgumentError
            return render json: { error: "Format de date invalide" }, status: :bad_request
        end
        
        # Rechercher les emprunts pour cette voiture et cette période
        emprunts = Emprunt.where(voiture_id: voiture_id)
                        .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                              date_fin, date_debut, date_debut, date_fin)
                        .includes(:utilisateur_demande, liste_passager: :utilisateurs) # Inclure les données de l'utilisateur demandeur et passagers
        
        # Date actuelle pour vérifier si un emprunt est en cours
        now = Time.zone.now
        
        # Transformer les emprunts au format attendu par le front
        emprunts_formattees = emprunts.map { |emprunt| format_emprunt_response(emprunt) }
        
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
        
        # Convertir les dates en gardant le fuseau horaire local
        begin
            date_debut = Time.zone.parse(date_debut)
            date_fin = Time.zone.parse(date_fin)
        rescue ArgumentError
            return render json: { error: "Format de date invalide" }, status: :bad_request
        end
        
        # S'assurer que les voitures appartiennent au site et à l'entreprise de l'utilisateur
        voitures = Voiture.where(id: voiture_ids, entreprise_id: entreprise_id, site_id: site_id)
        voiture_ids_filtres = voitures.pluck(:id)
        
        # Requête unique pour toutes les voitures avec les passagers et clés
        emprunts = Emprunt.where(voiture_id: voiture_ids_filtres)
                          .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                date_fin, date_debut, date_debut, date_fin)
                          .includes(:utilisateur_demande, :cle, liste_passager: :utilisateurs)
        
        # Date actuelle pour vérifier si un emprunt est en cours
        now = Time.zone.now
        
        # 🔍 LOGS BACKEND - Récupération emprunts
        Rails.logger.info "🔍 BACKEND GET - Emprunts trouvés: #{emprunts.count}"
        emprunts.each do |emprunt|
            Rails.logger.info "  - Emprunt ID #{emprunt.id}: #{emprunt.date_debut} -> #{emprunt.date_fin}"
        end
        
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
                     elsif emprunt.statut_emprunt == "Terminé"
                        "completed"
                     else
                        "empty"
                     end
            
            # Récupérer les informations de l'utilisateur demandeur
            utilisateur = emprunt.utilisateur_demande
            
            # Récupérer les informations des passagers
            passagers_info = if emprunt.liste_passager.present?
                emprunt.liste_passager.utilisateurs.map do |passager|
                    {
                        id: passager.id,
                        nom: passager.nom,
                        prenom: passager.prenom,
                        email: passager.email
                    }
                end
            else
                []
            end
            
            # Récupérer les informations de la clé assignée
            cle_info = if emprunt.cle.present?
                {
                    id: emprunt.cle.id,
                    statut_cle: emprunt.cle.statut_cle
                }
            else
                nil
            end
            
            {
                id: emprunt.id,
                carId: emprunt.voiture_id,
                startTime: emprunt.date_debut.in_time_zone(Time.zone),
                endTime: emprunt.date_fin.in_time_zone(Time.zone),
                status: status,
                utilisateur_id: emprunt.utilisateur_demande_id,
                utilisateur_nom: utilisateur&.nom,
                utilisateur_prenom: utilisateur&.prenom,
                nom_emprunt: emprunt.nom_emprunt,
                description: emprunt.description,
                cle_id: emprunt.cle_id,
                liste_passager_id: emprunt.liste_passager_id,
                localisation_id: emprunt.localisation_id,
                passagers: passagers_info,
                cle_info: cle_info
            }
        end
        
        render json: emprunts_formattees
    end
    
    # Créer un nouvel emprunt
    def create
        # 🔍 LOGS BACKEND - Paramètres reçus
        Rails.logger.info "🔍 BACKEND CREATE - Paramètres reçus:"
        Rails.logger.info "  - date_debut (string): #{params[:date_debut]}"
        Rails.logger.info "  - date_fin (string): #{params[:date_fin]}"
        Rails.logger.info "  - voiture_id: #{params[:voiture_id]}"
        Rails.logger.info "  - nom_emprunt: #{params[:nom_emprunt]}"
        Rails.logger.info "  - Time.zone configuré: #{Time.zone}"
        
        # Valider les paramètres requis
        if params[:voiture_id].blank? || params[:date_debut].blank? || params[:date_fin].blank? ||
                          params[:nom_emprunt].blank? || params[:description].blank?
            return render json: { error: "Paramètres requis manquants" }, status: :bad_request
        end
        
        # Vérifier s'il y a des chevauchements avec d'autres emprunts
        voiture_id = params[:voiture_id]
        date_debut = params[:date_debut]
        date_fin = params[:date_fin]
        
        # 🔍 LOGS BACKEND - Avant parsing des dates
        Rails.logger.info "🔍 BACKEND CREATE - Avant parsing:"
        Rails.logger.info "  - date_debut (avant): #{date_debut} (#{date_debut.class})"
        Rails.logger.info "  - date_fin (avant): #{date_fin} (#{date_fin.class})"
        
        chevauchements = verifier_chevauchements(voiture_id, date_debut, date_fin)
        
        if chevauchements.any?
            return render json: { 
                error: "Il existe déjà un emprunt pour cette voiture sur ce créneau horaire",
                emprunts_en_conflit: chevauchements.map { |e| e.id }
            }, status: :conflict
        end
        
        # Vérifier que la voiture a des clés configurées
        unless EmpruntService.car_has_keys?(voiture_id)
            return render json: { 
                error: "Impossible de créer un emprunt pour cette voiture. Aucune clé principale ou double n'a été configurée. Veuillez contacter l'administrateur."
            }, status: :unprocessable_entity
        end
        
        # Vérifier le statut de la voiture
        voiture = Voiture.find(voiture_id)
        unless voiture.statut_voiture == "Fonctionnelle"
            return render json: { 
                error: "Cette voiture n'est pas disponible pour la réservation (statut: #{voiture.statut_voiture})"
            }, status: :unprocessable_entity
        end

        # 🔍 LOGS BACKEND - Avant création de l'emprunt
        Rails.logger.info "🔍 BACKEND CREATE - Création emprunt avec:"
        Rails.logger.info "  - date_debut final: #{date_debut} (#{date_debut.class})"
        Rails.logger.info "  - date_fin final: #{date_fin} (#{date_fin.class})"
        
        # Créer un nouvel emprunt avec le statut "brouillon"
        emprunt = Emprunt.new(
            voiture_id: voiture_id,
            date_debut: date_debut,
            date_fin: date_fin,
            nom_emprunt: params[:nom_emprunt],
            description: params[:description],
            statut_emprunt: "brouillon",
            utilisateur_demande_id: @current_user.id,
            localisation_id: params[:localisation_id],
            created_at: Time.zone.now,
            updated_at: Time.zone.now
        )
        
        # 🔍 LOGS BACKEND - Après création objet emprunt
        Rails.logger.info "🔍 BACKEND CREATE - Objet emprunt créé:"
        Rails.logger.info "  - emprunt.date_debut: #{emprunt.date_debut} (#{emprunt.date_debut.class})"
        Rails.logger.info "  - emprunt.date_fin: #{emprunt.date_fin} (#{emprunt.date_fin.class})"

        # Assigner automatiquement une clé
        Rails.logger.info "🔑 CRÉATION EMPRUNT - Recherche clé pour voiture #{voiture_id}"
        EmpruntService.assign_primary_key(emprunt)

        # Créer toujours une liste de passagers vide
        EmpruntService.creer_liste_passager_vide(emprunt)

        # Gérer les passagers si fournis
        if params[:passagers].present? && params[:passagers].any?
            # Filtrer les passagers pour exclure le conducteur
            passagers_valides = params[:passagers].reject { |id| id.to_i == @current_user.id }
            
            if passagers_valides.any?
                # Vérifier la capacité du véhicule
                voiture = Voiture.find(voiture_id)
                nombre_total_occupants = 1 + passagers_valides.count # conducteur + passagers
                
                if nombre_total_occupants > voiture.nombre_places
                    return render json: { 
                        error: "Le nombre total d'occupants (#{nombre_total_occupants}) dépasse la capacité du véhicule (#{voiture.nombre_places} places)"
                    }, status: :bad_request
                end
                
                # Ajouter les passagers à la liste vide
                EmpruntService.mettre_a_jour_passagers(emprunt, passagers_valides)
            end
        end
        
        if emprunt.save
            # 🔍 LOGS BACKEND - Après sauvegarde
            Rails.logger.info "✅ BACKEND CREATE - Emprunt sauvegardé en BD:"
            Rails.logger.info "  - ID: #{emprunt.id}"
            Rails.logger.info "  - date_debut en BD: #{emprunt.date_debut}"
            Rails.logger.info "  - date_fin en BD: #{emprunt.date_fin}"
            
            # Recharger avec les relations pour le formatage
            emprunt.reload
            emprunt = Emprunt.includes(:utilisateur_demande, :cle, liste_passager: :utilisateurs).find(emprunt.id)
            
            # 🔍 LOGS BACKEND - Avant formatage réponse
            Rails.logger.info "🔍 BACKEND CREATE - Avant formatage réponse:"
            Rails.logger.info "  - emprunt.date_debut (reload): #{emprunt.date_debut}"
            Rails.logger.info "  - emprunt.date_fin (reload): #{emprunt.date_fin}"
            
            response = format_emprunt_response(emprunt)
            
            # 🔍 LOGS BACKEND - Réponse formatée
            Rails.logger.info "🔍 BACKEND CREATE - Réponse formatée:"
            Rails.logger.info "  - startTime: #{response[:startTime]}"
            Rails.logger.info "  - endTime: #{response[:endTime]}"
            
            render json: response, status: :created
        else
            Rails.logger.error "❌ BACKEND CREATE - Erreurs validation: #{emprunt.errors.full_messages}"
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
        
        # Mettre à jour les champs de l'emprunt (la clé est préservée automatiquement)
        emprunt.date_debut = params[:date_debut] if params[:date_debut].present?
        emprunt.date_fin = params[:date_fin] if params[:date_fin].present?
        emprunt.nom_emprunt = params[:nom_emprunt] if params[:nom_emprunt].present?
        emprunt.description = params[:description] if params[:description].present?
        emprunt.localisation_id = params[:localisation_id] if params.key?(:localisation_id)
        emprunt.updated_at = Time.zone.now

        Rails.logger.info "🔑 MODIFICATION EMPRUNT - Clé préservée: #{emprunt.cle_id}"

        # Mettre à jour la liste des passagers avec la nouvelle structure
        if params.key?(:passagers)
            Rails.logger.info "🚗 UPDATE PASSAGERS - Paramètres reçus: #{params[:passagers]}"
            Rails.logger.info "🚗 UPDATE PASSAGERS - Passagers actuels: #{EmpruntService.passager_ids(emprunt)}"

            if params[:passagers].present?
                # Filtrer les passagers pour exclure le conducteur
                passagers_valides = params[:passagers].reject { |id| id.to_i == @current_user.id }
                Rails.logger.info "🚗 UPDATE PASSAGERS - Passagers valides après filtrage: #{passagers_valides}"

                if passagers_valides.any?
                    # Vérifier la capacité du véhicule
                    nombre_total_occupants = 1 + passagers_valides.count # conducteur + passagers

                    if nombre_total_occupants > emprunt.voiture.nombre_places
                        return render json: { 
                            error: "Le nombre total d'occupants (#{nombre_total_occupants}) dépasse la capacité du véhicule (#{emprunt.voiture.nombre_places} places)"
                        }, status: :bad_request
                    end

                    Rails.logger.info "🚗 UPDATE PASSAGERS - Appel mettre_a_jour_passagers avec: #{passagers_valides}"
                    EmpruntService.mettre_a_jour_passagers(emprunt, passagers_valides)
                else
                    Rails.logger.info "🚗 UPDATE PASSAGERS - Aucun passager valide, suppression de toutes les relations"
                    EmpruntService.mettre_a_jour_passagers(emprunt, [])
                end
            else
                Rails.logger.info "🚗 UPDATE PASSAGERS - Paramètre passagers vide, suppression de toutes les relations"
                EmpruntService.mettre_a_jour_passagers(emprunt, [])
            end

            Rails.logger.info "🚗 UPDATE PASSAGERS - Passagers après modification: #{EmpruntService.passager_ids(emprunt)}"
        end

        if emprunt.save
            # Recharger avec les relations pour le formatage
            emprunt = Emprunt.includes(:utilisateur_demande, :cle, liste_passager: :utilisateurs).find(emprunt.id)
            render json: format_emprunt_response(emprunt)
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

        if emprunt.save
            render json: emprunt
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def terminer
        emprunt = Emprunt.find(params[:id])
        current_user = @current_user

        # Vérifier que l'utilisateur est un administrateur
        unless current_user.admin_entreprise || current_user.admin_rentecaisse
            return render json: { error: "Vous n'êtes pas autorisé à terminer cet emprunt" }, status: :forbidden
        end

        # Mettre à jour le statut de l'emprunt
        emprunt.statut_emprunt = "Terminé"

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
        emprunt.updated_at = Time.zone.now

        if emprunt.save
            render json: emprunt
        else
            render json: { error: emprunt.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # Récupérer le nombre d'emprunts en attente de validation pour l'entreprise et le site de l'utilisateur
    def get_pending_count
        # Vérifier que l'utilisateur est un administrateur
        unless @current_user.admin_entreprise || @current_user.admin_rentecaisse
            return render json: { error: "Vous n'êtes pas autorisé à accéder à cette information" }, status: :forbidden
        end
        
        entreprise_id = @current_user.entreprise_id
        site_id = @current_user.site_id
        
        # Utiliser le service pour compter les emprunts en attente
        count = EmpruntService.count_pending_validations(entreprise_id, site_id)
        
        render json: { pending_count: count }
    end

    # Récupérer le nombre d'emprunts à terminer pour l'entreprise et le site de l'utilisateur
    def get_to_complete_count
        # Vérifier que l'utilisateur est un administrateur
        unless @current_user.admin_entreprise || @current_user.admin_rentecaisse
            return render json: { error: "Vous n'êtes pas autorisé à accéder à cette information" }, status: :forbidden
        end
        
        entreprise_id = @current_user.entreprise_id
        site_id = @current_user.site_id
        
        # Utiliser le service pour compter les emprunts à terminer
        count = EmpruntService.count_expired_validations(entreprise_id, site_id)
        
        render json: { to_complete_count: count }
    end
    private

    # Formater la réponse d'un emprunt avec toutes les informations
    def format_emprunt_response(emprunt)
        # Mapper le statut
        status = case emprunt.statut_emprunt
                 when "validé"
                     now = Time.zone.now
                     if now >= emprunt.date_debut && now <= emprunt.date_fin
                         "en_cours"
                     else
                         "confirmed" 
                     end
                 when "brouillon"
                     "draft"
                 when "en_attente_validation"  
                     "pending_validation"
                 when "completed"
                     "completed"
                 else
                     "empty"
                 end

        # Récupérer les informations des passagers
        passagers_info = if emprunt.liste_passager.present?
            emprunt.liste_passager.utilisateurs.map do |passager|
                {
                    id: passager.id,
                    nom: passager.nom,
                    prenom: passager.prenom,
                    email: passager.email
                }
            end
        else
            []
        end

        # Récupérer les informations de la clé assignée
        cle_info = if emprunt.cle.present?
            {
                id: emprunt.cle.id,
                statut_cle: emprunt.cle.statut_cle
            }
        else
            nil
        end

        {
            id: emprunt.id,
            carId: emprunt.voiture_id,
            startTime: emprunt.date_debut.in_time_zone(Time.zone),
            endTime: emprunt.date_fin.in_time_zone(Time.zone),
            status: status,
            utilisateur_id: emprunt.utilisateur_demande_id,
            utilisateur_nom: emprunt.utilisateur_demande&.nom,
            utilisateur_prenom: emprunt.utilisateur_demande&.prenom,
            nom_emprunt: emprunt.nom_emprunt,
            description: emprunt.description,
            cle_id: emprunt.cle_id,
            liste_passager_id: emprunt.liste_passager_id,
            localisation_id: emprunt.localisation_id,
            passagers: passagers_info,
            cle_info: cle_info
        }
    end

    # Vérifier s'il y a des chevauchements avec d'autres emprunts
    def verifier_chevauchements(voiture_id, date_debut, date_fin, emprunt_id = nil)
        # Convertir les dates si nécessaire en gardant le fuseau horaire local
        date_debut = Time.zone.parse(date_debut) if date_debut.is_a?(String)
        date_fin = Time.zone.parse(date_fin) if date_fin.is_a?(String)

        # Rechercher les emprunts qui se chevauchent
        query = Emprunt.where(voiture_id: voiture_id)
                     .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?) OR (date_debut <= ? AND date_fin >= ?)", 
                           date_fin, date_debut, date_debut, date_fin, date_debut, date_debut)

        # Exclure l'emprunt en cours de modification s'il est spécifié
        query = query.where.not(id: emprunt_id) if emprunt_id.present?

        query
    end
end
