class LocalisationsController < ApplicationController
  before_action :verify_authentication
  # Récupérer toutes les localisations
  def fetch_all
    localisations = Localisation.all
    render json: localisations
  end
  
  # Récupérer une localisation spécifique
  def fetch
    id = params[:id]
    
    if id.blank?
      return render json: { error: "L'ID de la localisation est requis" }, status: :bad_request
    end
    
    begin
      localisation = Localisation.find(id)
      render json: localisation
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Localisation non trouvée" }, status: :not_found
    end
  end
  
  # Créer une nouvelle localisation
  def create
    # Valider les paramètres requis
    if params[:nom_localisation].blank? || params[:adresse].blank? || params[:ville].blank?
      return render json: { error: "Les champs nom, adresse et ville sont requis" }, status: :bad_request
    end
    
    # Créer la localisation
    localisation = Localisation.new(
      nom_localisation: params[:nom_localisation],
      adresse: params[:adresse],
      code_postal: params[:code_postal],
      ville: params[:ville],
      pays: params[:pays] || 'France',
      email: params[:email],
      site_web: params[:site_web]
    )
    
    if localisation.save
      render json: localisation, status: :created
    else
      render json: { error: localisation.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # Mettre à jour une localisation existante
  def update
    id = params[:id]
    
    if id.blank?
      return render json: { error: "L'ID de la localisation est requis" }, status: :bad_request
    end
    
    begin
      localisation = Localisation.find(id)
      
      # Mettre à jour les champs de la localisation
      localisation.nom_localisation = params[:nom_localisation] if params[:nom_localisation].present?
      localisation.adresse = params[:adresse] if params[:adresse].present?
      localisation.code_postal = params[:code_postal] if params[:code_postal].present?
      localisation.ville = params[:ville] if params[:ville].present?
      localisation.pays = params[:pays] if params[:pays].present?
      localisation.email = params[:email] if params[:email].present?
      localisation.site_web = params[:site_web] if params[:site_web].present?
      
      if localisation.save
        render json: localisation
      else
        render json: { error: localisation.errors.full_messages }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Localisation non trouvée" }, status: :not_found
    end
  end
  
  # Supprimer une localisation
  def destroy
    id = params[:id]
    
    if id.blank?
      return render json: { error: "L'ID de la localisation est requis" }, status: :bad_request
    end
    
    begin
      localisation = Localisation.find(id)
      
      # Vérifier si la localisation est utilisée dans des emprunts
      if Emprunt.where(localisation_id: id).exists?
        return render json: { error: "Impossible de supprimer cette localisation car elle est utilisée dans des emprunts" }, status: :unprocessable_entity
      end
      
      if localisation.destroy
        render json: { message: "Localisation supprimée avec succès" }
      else
        render json: { error: "Impossible de supprimer la localisation" }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Localisation non trouvée" }, status: :not_found
    end
  end
end 