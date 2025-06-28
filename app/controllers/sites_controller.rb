class SitesController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    sites = Site.all.where(entreprise_id: @current_user.entreprise_id)
    
    # Transformer les données pour inclure les images encodées en base64
    sites_formatees = sites.map do |site|
      # Données de base du site
      site_data = site.to_format
      
      # Par défaut, utiliser l'image placeholder
      site_data[:image] = "/images/placeholders/site-placeholder.svg"
      
      # Si le site a une image, l'encoder en base64
      if site.lien_image_site.present?
        site_data[:image] = SiteService.get_site_image(site)
      end
      
      site_data
    end

    render json: sites_formatees
  end

  def fetch
    site_id = params[:id]
    site = Entreprise.find(site_id)

    render json: site
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = @current_user["entreprise_id"]

    newSite = Site.create(attributes)

    render json: newSite.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    Site.find(attributes["id"]).update(attributes)
    updatedSite = Site.find(attributes["id"])

    render json: updatedSite.to_format
  end

  def delete
    Site.find(params["id"]).delete

    render json: { "id" => params["id"] }
  end

  def update_photo
    site = Site.find_by(id: params[:id])
    
    unless site
      render json: { 
        success: false, 
        message: "Site non trouvé" 
      }, status: :not_found
      return
    end
    
    unless params[:photo]
      render json: { 
        success: false, 
        message: "Aucune photo fournie" 
      }, status: :unprocessable_entity
      return
    end
    
    result = SiteService.update_site_photo(site, params[:photo])
    
    if result[:success]
      render json: { 
        success: true, 
        message: result[:message]
      }
    else
      render json: { 
        success: false, 
        message: result[:message]
      }, status: :unprocessable_entity
    end
  end
end
