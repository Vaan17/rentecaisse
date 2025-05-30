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
      {
        id: voiture.id,
        name: "#{voiture.marque} #{voiture.modele}",
        seats: voiture.nombre_places,
        doors: voiture.nombre_portes,
        transmission: voiture.type_boite,
        licensePlate: voiture.immatriculation,
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