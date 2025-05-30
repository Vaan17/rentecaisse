class VoituresController < ApplicationController
  before_action :verify_authentication
  def fetch_all
    voitures = Voiture.all

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
  end

  def update
  end

  def delete
  end
end