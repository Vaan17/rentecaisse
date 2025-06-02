class EmpruntsUserController < ApplicationController
      
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
    
end