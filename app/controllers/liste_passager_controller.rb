class ListePassagerController < ApplicationController
  # Récupérer tous les utilisateurs du site pour sélection comme passagers
  def fetch_utilisateurs_site
    current_user_id = params[:user_id]
    
    if current_user_id.blank?
      return render json: { error: "L'ID de l'utilisateur est requis" }, status: :bad_request
    end
    
    # Récupérer l'utilisateur actuel et son site
    begin
      current_user = Utilisateur.find(current_user_id)
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "Utilisateur non trouvé" }, status: :not_found
    end
    
    # Vérifier que l'utilisateur est bien lié à un site
    if current_user.site.nil?
      return render json: { error: "L'utilisateur n'est pas rattaché à un site" }, status: :bad_request
    end
    
    # Récupérer tous les utilisateurs du même site
    utilisateurs = Utilisateur.where(site_id: current_user.site_id)
    
    # Transformer les données pour les rendre compatibles avec le front-end
    utilisateurs_formattees = utilisateurs.map do |utilisateur|
      {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email
      }
    end
    
    render json: utilisateurs_formattees
  end
  
  # Récupérer les passagers d'une liste spécifique
  def fetch_passagers_liste
    liste_id = params[:liste_id]
    
    if liste_id.blank?
      return render json: { error: "L'ID de la liste est requis" }, status: :bad_request
    end
    
    begin
      liste = ListePassager.find(liste_id)
    rescue ActiveRecord::RecordNotFound
      return render json: { error: "Liste de passagers non trouvée" }, status: :not_found
    end
    
    # Récupérer les utilisateurs liés à cette liste
    passagers_ids = ListePassagerUtilisateur.where(liste_passager_id: liste_id).pluck(:utilisateur_id)
    passagers = Utilisateur.where(id: passagers_ids)
    
    # Transformer les données pour les rendre compatibles avec le front-end
    passagers_formattees = passagers.map do |passager|
      {
        id: passager.id,
        nom: passager.nom,
        prenom: passager.prenom,
        email: passager.email
      }
    end
    
    render json: passagers_formattees
  end
end 