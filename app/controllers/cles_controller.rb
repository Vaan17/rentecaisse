class ClesController < ApplicationController
  
  # Récupérer les clés pour une voiture spécifique
  def fetch_by_voiture
    voiture_id = params[:voiture_id]
    
    if voiture_id.blank?
      return render json: { error: "L'ID de la voiture est requis" }, status: :bad_request
    end
    
    cles = Cle.where(voiture_id: voiture_id)
    
    render json: cles
  end
  
  # Récupérer les clés disponibles pour une voiture (non associées à un emprunt en cours)
  def fetch_disponibles_by_voiture
    voiture_id = params[:voiture_id]
    date_debut = params[:date_debut]
    date_fin = params[:date_fin]
    
    if voiture_id.blank?
      return render json: { error: "L'ID de la voiture est requis" }, status: :bad_request
    end
    
    # Récupérer toutes les clés de la voiture
    cles = Cle.where(voiture_id: voiture_id)
    
    # Si des dates sont spécifiées, exclure les clés utilisées dans des emprunts à ces dates
    if date_debut.present? && date_fin.present?
      begin
        date_debut = DateTime.parse(date_debut)
        date_fin = DateTime.parse(date_fin)
      rescue ArgumentError
        return render json: { error: "Format de date invalide" }, status: :bad_request
      end
      
      # Récupérer les IDs des clés déjà utilisées dans des emprunts pour cette période
      cles_utilisees_ids = Emprunt.where(cle_id: cles.pluck(:id))
                                .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                      date_fin, date_debut, date_debut, date_fin)
                                .pluck(:cle_id)
      
      # Exclure ces clés
      cles = cles.where.not(id: cles_utilisees_ids)
    end
    
    render json: cles
  end
end 
  before_action :verify_authentication

  def fetch_all
    entreprise_sites = Site.all.where(entreprise_id: @current_user.entreprise_id)
    siteIds = entreprise_sites.map do |site|
      site.id
    end

    cles = Cle.all.where(site_id: siteIds)
    cles = cles.map(&:to_format)

    render json: cles
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    newKey = Cle.create(attributes)

    render json: newKey.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    Cle.find(attributes["id"]).update(attributes)
    updatedKey = Cle.find(attributes["id"])

    render json: updatedKey.to_format
  end

  def delete
    Cle.find(params["id"]).delete

    render json: { "id" => params["id"] }
  end
end
