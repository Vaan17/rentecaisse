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
    site_id = attributes["id"]
    site = Site.find(site_id)

    # Filtrer les attributs autorisés pour éviter d'écraser des champs sensibles
    allowed_attributes = attributes.slice(
      "nom_site", "adresse", "code_postal", "ville", "pays", 
      "telephone", "email", "site_web"
    )

    # Préserver le lien_image_site existant si pas fourni dans les données
    if attributes["lien_image_site"].present?
      allowed_attributes["lien_image_site"] = attributes["lien_image_site"]
    end

    site.update(allowed_attributes)
    updatedSite = Site.find(site_id)

    # Récupérer les données formatées avec l'image
    site_data = updatedSite.to_format
    site_data[:image] = SiteService.get_site_image(updatedSite)

    render json: site_data
  end

  def delete
    site = Site.find(params["id"])
    
    # Supprimer le dossier d'images du site s'il existe
    if site.lien_image_site.present? || Dir.exist?(Rails.root.join('storage', 'sites', "site_#{site.id}"))
      image_folder_path = Rails.root.join('storage', 'sites', "site_#{site.id}")
      
      if Dir.exist?(image_folder_path)
        begin
          FileUtils.remove_dir(image_folder_path)
          Rails.logger.info "🗑️ SITE_DELETE - Dossier d'images supprimé: #{image_folder_path}"
        rescue StandardError => e
          Rails.logger.error "❌ SITE_DELETE - Erreur lors de la suppression du dossier d'images: #{e.message}"
        end
      end
    end
    
    # Supprimer le site de la base de données
    site.destroy  # Utiliser destroy au lieu de delete pour déclencher les callbacks
    Rails.logger.info "🗑️ SITE_DELETE - Site #{params['id']} supprimé avec succès"

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

  def delete_photo
    site = Site.find_by(id: params[:id])
    
    unless site
      render json: { 
        success: false, 
        message: "Site non trouvé" 
      }, status: :not_found
      return
    end
    
    unless site.lien_image_site.present?
      render json: { 
        success: false, 
        message: "Aucune image à supprimer" 
      }, status: :unprocessable_entity
      return
    end
    
    result = SiteService.delete_site_photo(site)
    
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

  def update_with_photo
    site_data = {}
    if params["data"].present?
      begin
        site_data = JSON.parse(params["data"])
      rescue JSON::ParserError => e
        Rails.logger.error "Erreur de parsing JSON: #{e.message}"
        render json: { 
          success: false, 
          message: "Données invalides" 
        }, status: :bad_request
        return
      end
    end
    
    site_id = params[:id] || site_data["id"]
    photo = params[:photo]

    site = Site.find_by(id: site_id)
    
    unless site
      render json: { 
        success: false, 
        message: "Site non trouvé" 
      }, status: :not_found
      return
    end

    result = SiteService.update_site_with_photo(site, site_data, photo)
    
    if result[:success]
      # Récupérer les données formatées avec l'image
      updated_site = Site.find(site_id)
      site_response = updated_site.to_format
      site_response[:image] = SiteService.get_site_image(updated_site)
      
      render json: site_response
    else
      render json: { 
        success: false, 
        message: result[:message],
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end
end
