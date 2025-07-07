class VoituresController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    voitures = Voiture.all.where(entreprise_id: @current_user.entreprise_id)
    
    # Transformer les données pour inclure les images encodées en base64
    voitures_formattees = voitures.map do |voiture|
      # Données de base de la voiture
      voiture_data = voiture.to_format
      
      # Ajouter les propriétés compatibles avec le front-end emprunts
      voiture_data[:name] = "#{voiture.marque} #{voiture.modele}"
      voiture_data[:seats] = voiture.nombre_places
      voiture_data[:doors] = voiture.nombre_portes
      voiture_data[:transmission] = voiture.type_boite
      voiture_data[:licensePlate] = voiture.immatriculation
      
      # Par défaut, utiliser l'image placeholder
      voiture_data[:image] = "/images/car-placeholder.png"
      
      # Récupérer l'image de la voiture si disponible
      image_data = VoitureService.get_voiture_image(voiture.id)
      if image_data
        # Remplacer l'image placeholder par l'URL data en base64
        voiture_data[:image] = "data:#{image_data[:content_type]};base64,#{image_data[:image_data]}"
      end
      
      voiture_data
    end

    render json: voitures_formattees
  end

  def fetch_voitures_site
    # Récupérer l'utilisateur actuel et son site
    current_user = Utilisateur.find(params[:user_id])
    
    # Vérifier que l'utilisateur est bien lié à un site
    if current_user.site.nil?
      return render json: { error: "L'utilisateur n'est pas rattaché à un site" }, status: :bad_request
    end
    
    # Récupérer les voitures du même site et de la même entreprise que l'utilisateur
    voitures = Voiture.where(site_id: current_user.site_id, entreprise_id: current_user.entreprise_id)
    
    # Transformer les données pour les rendre compatibles avec le front-end
    voitures_formattees = voitures.map do |voiture|
      # Données de base de la voiture
      voiture_data = {
        id: voiture.id,
        name: "#{voiture.marque} #{voiture.modele}",
        seats: voiture.nombre_places,
        doors: voiture.nombre_portes,
        transmission: voiture.type_boite,
        licensePlate: voiture.immatriculation,
        # Par défaut, utiliser l'image placeholder
        image: "/images/car-placeholder.png",
        # Ajout des données complètes pour le back-end
        marque: voiture.marque,
        modele: voiture.modele,
        annee_fabrication: voiture.année_fabrication,
        carburant: voiture.carburant,
        couleur: voiture.couleur,
        puissance: voiture.puissance,
        statut_voiture: voiture.statut_voiture
      }
      
      # Récupérer l'image de la voiture si disponible
      image_data = VoitureService.get_voiture_image(voiture.id)
      if image_data
        # Remplacer l'image placeholder par l'URL data en base64
        voiture_data[:image] = "data:#{image_data[:content_type]};base64,#{image_data[:image_data]}"
      end
      
      voiture_data
    end
    
    render json: voitures_formattees
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    attributes["entreprise_id"] = @current_user["entreprise_id"]

    if Voiture.exists?(immatriculation: attributes["immatriculation"])
      render json: { error: "Immatriculation already exists" }, status: :unprocessable_entity
      return
    end

    newCar = Voiture.create(attributes)

    render json: newCar.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h
    voiture_id = attributes["id"]

    # Filtrer les attributs pour ne garder que ceux du modèle Voiture
    allowed_attributes = attributes.slice(
      "marque", "modele", "année_fabrication", "immatriculation", 
      "carburant", "couleur", "puissance", "nombre_portes", 
      "nombre_places", "type_boite", "statut_voiture", 
      "lien_image_voiture", "entreprise_id", "site_id"
    )

    # Vérifier si une AUTRE voiture a la même immatriculation
    existing_voiture = Voiture.find_by(immatriculation: allowed_attributes["immatriculation"])
    if existing_voiture && existing_voiture.id != voiture_id.to_i
      render json: { error: "Immatriculation already exists" }, status: :unprocessable_entity
      return
    end

    Voiture.find(voiture_id).update(allowed_attributes)
    updatedCar = Voiture.find(voiture_id)

    render json: updatedCar.to_format
  end

  def delete
    voiture = Voiture.find(params["id"])
    
    # Supprimer le dossier d'images de la voiture s'il existe
    if voiture.lien_image_voiture.present? || Dir.exist?(Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}"))
      image_folder_path = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}")
      
      if Dir.exist?(image_folder_path)
        begin
          FileUtils.remove_dir(image_folder_path)
          Rails.logger.info "🗑️ VOITURE_DELETE - Dossier d'images supprimé: #{image_folder_path}"
        rescue StandardError => e
          Rails.logger.error "❌ VOITURE_DELETE - Erreur lors de la suppression du dossier d'images: #{e.message}"
        end
      end
    end
    
    # Supprimer la voiture de la base de données
    voiture.destroy  # Utiliser destroy au lieu de delete pour déclencher les callbacks
    Rails.logger.info "🗑️ VOITURE_DELETE - Voiture #{params['id']} supprimée avec succès"

    render json: { "id" => params["id"] }
  end

  def update_photo
    voiture = Voiture.find_by(id: params[:id])
    
    unless voiture
      render json: { 
        success: false, 
        message: "Voiture non trouvée" 
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
    
    result = VoitureService.update_voiture_photo(voiture, params[:photo])
    
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