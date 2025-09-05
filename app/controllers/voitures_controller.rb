class VoituresController < ApplicationController
  before_action :verify_authentication, except: [:get_image]

  def fetch_all
    Rails.logger.info "[VOITURES#fetch_all] user_id=#{@current_user.id} entreprise_id=#{@current_user.entreprise_id}"
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
      
      # Récupérer l'URL de l'image de la voiture si disponible
      if voiture.lien_image_voiture.present?
        # Ajouter un cache-buster pour forcer le rafraîchissement côté client
        voiture_data[:image] = "#{request.base_url}/api/voitures/#{voiture.id}/image?t=#{Time.now.to_i}"
      else
        # Image placeholder par défaut si aucune image n'est associée
        voiture_data[:image] = nil # Le front-end gérera l'affichage d'un placeholder
      end
      
      voiture_data
    end

    Rails.logger.info "[VOITURES#fetch_all] count=#{voitures_formattees.size}"
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
        # L'image sera ajoutée ci-dessous
        image: nil,
        # Ajout des données complètes pour le back-end
        marque: voiture.marque,
        modele: voiture.modele,
        annee_fabrication: voiture.année_fabrication,
        carburant: voiture.carburant,
        couleur: voiture.couleur,
        puissance: voiture.puissance,
        statut_voiture: voiture.statut_voiture
      }
      
      # Récupérer l'URL de l'image de la voiture si disponible
      if voiture.lien_image_voiture.present?
        voiture_data[:image] = "#{request.base_url}/api/voitures/#{voiture.id}/image?t=#{Time.now.to_i}"
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
    Rails.logger.info "[VOITURES#update] voiture_id=#{voiture_id} attributes_keys=#{attributes.keys}"

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
    Rails.logger.info "[VOITURES#update] updated voiture_id=#{updatedCar.id} has_image=#{updatedCar.lien_image_voiture.present?}"

    # Construire la réponse enrichie avec l'URL d'image (comme fetch_all)
    voiture_data = updatedCar.to_format
    if updatedCar.lien_image_voiture.present?
      voiture_data[:image] = "#{request.base_url}/api/voitures/#{updatedCar.id}/image?t=#{Time.now.to_i}"
    else
      voiture_data[:image] = nil
    end

    # Alignement des propriétés additionnelles utilisées côté front (emprunts)
    voiture_data[:name] = "#{updatedCar.marque} #{updatedCar.modele}"
    voiture_data[:seats] = updatedCar.nombre_places
    voiture_data[:doors] = updatedCar.nombre_portes
    voiture_data[:transmission] = updatedCar.type_boite
    voiture_data[:licensePlate] = updatedCar.immatriculation

    render json: voiture_data
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
    Rails.logger.info "[VOITURES#update_photo] voiture_id=#{params[:id]} has_file=#{params[:photo].present?}"
    
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
      # Recharger la voiture depuis la base pour avoir les données fraîches
      voiture.reload
      voiture_data = voiture.to_format
      
      # Ajouter l'URL de l'image si elle existe
      if voiture.lien_image_voiture.present?
        voiture_data[:image] = "#{request.base_url}/api/voitures/#{voiture.id}/image?t=#{Time.now.to_i}"
      else
        voiture_data[:image] = nil
      end
      
      # Ajouter les propriétés compatibles avec le front-end emprunts
      voiture_data[:name] = "#{voiture.marque} #{voiture.modele}"
      voiture_data[:seats] = voiture.nombre_places
      voiture_data[:doors] = voiture.nombre_portes
      voiture_data[:transmission] = voiture.type_boite
      voiture_data[:licensePlate] = voiture.immatriculation
      
      Rails.logger.info "[VOITURES#update_photo] success voiture_id=#{voiture.id}"
      render json: { 
        success: true, 
        message: result[:message],
        voiture: voiture_data
      }
    else
      Rails.logger.warn "[VOITURES#update_photo] failure voiture_id=#{voiture.id} message=#{result[:message]}"
      render json: { 
        success: false, 
        message: result[:message]
      }, status: :unprocessable_entity
    end
  end

  def delete_photo
    voiture = Voiture.find_by(id: params[:id])
    Rails.logger.info "[VOITURES#delete_photo] voiture_id=#{params[:id]}"
    
    unless voiture
      render json: { 
        success: false, 
        message: "Voiture non trouvée" 
      }, status: :not_found
      return
    end
    
    unless voiture.lien_image_voiture.present?
      render json: { 
        success: false, 
        message: "Aucune image à supprimer" 
      }, status: :unprocessable_entity
      return
    end
    
    result = VoitureService.delete_voiture_photo(voiture)
    
    if result[:success]
      # Recharger la voiture depuis la base pour avoir les données fraîches
      voiture.reload
      voiture_data = voiture.to_format
      
      # L'image a été supprimée, donc pas d'URL d'image
      voiture_data[:image] = nil
      
      # Ajouter les propriétés compatibles avec le front-end emprunts
      voiture_data[:name] = "#{voiture.marque} #{voiture.modele}"
      voiture_data[:seats] = voiture.nombre_places
      voiture_data[:doors] = voiture.nombre_portes
      voiture_data[:transmission] = voiture.type_boite
      voiture_data[:licensePlate] = voiture.immatriculation
      
      Rails.logger.info "[VOITURES#delete_photo] success voiture_id=#{voiture.id}"
      render json: { 
        success: true, 
        message: result[:message],
        voiture: voiture_data
      }
    else
      Rails.logger.warn "[VOITURES#delete_photo] failure voiture_id=#{voiture.id} message=#{result[:message]}"
      render json: { 
        success: false, 
        message: result[:message]
      }, status: :unprocessable_entity
    end
  end

  def get_image
    voiture = Voiture.find_by(id: params[:id])
    Rails.logger.info "[VOITURES#get_image] voiture_id=#{params[:id]}"
    
    unless voiture
      return render json: { error: "Voiture non trouvée" }, status: :not_found
    end
    
    unless voiture.lien_image_voiture.present?
      return render json: { error: "Aucune image associée à cette voiture" }, status: :not_found
    end
    
    image_path = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture.id}", voiture.lien_image_voiture)
    
    unless File.exist?(image_path)
      return render json: { error: "Fichier image non trouvé" }, status: :not_found
    end
    
    # Déterminer le type MIME basé sur l'extension
    content_type = case File.extname(image_path).downcase
                   when '.jpg', '.jpeg'
                     'image/jpeg'
                   when '.png'
                     'image/png'
                   when '.gif'
                     'image/gif'
                   else
                     'application/octet-stream'
                   end
    
    # Désactiver le cache côté client pour garantir l'affichage de l'image fraîche
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    send_file image_path, type: content_type, disposition: 'inline'
  end
end