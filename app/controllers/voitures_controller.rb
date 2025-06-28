class VoituresController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    voitures = Voiture.all.where(entreprise_id: @current_user.entreprise_id)
    voitures = voitures.map(&:to_format)

    render json: voitures
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

    if Voiture.exists?(immatriculation: attributes["immatriculation"])
      render json: { error: "Immatriculation already exists" }, status: :unprocessable_entity
      return
    end

    Voiture.find(attributes["id"]).update(attributes)
    updatedCar = Voiture.find(attributes["id"])

    render json: updatedCar.to_format
  end

  def delete
    Voiture.find(params["id"]).delete

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