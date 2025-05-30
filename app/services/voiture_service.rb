class VoitureService
  # Récupère les voitures du site et de l'entreprise de l'utilisateur
  def self.voitures_par_site_et_entreprise(site_id, entreprise_id)
    Voiture.where(site_id: site_id, entreprise_id: entreprise_id)
  end
  
  # Vérifie si une voiture est disponible pour un intervalle de temps donné
  def self.voiture_disponible?(voiture_id, date_debut, date_fin)
    # Recherche d'emprunts qui se chevauchent avec l'intervalle demandé
    emprunts_chevauchants = Emprunt.where(voiture_id: voiture_id)
                                  .where("(date_debut <= ? AND date_fin >= ?) OR (date_debut <= ? AND date_fin >= ?) OR (date_debut >= ? AND date_fin <= ?)", 
                                  date_fin, date_debut, date_fin, date_debut, date_debut, date_fin)
                                  
    # Retourne true s'il n'y a pas d'emprunts chevauchants
    emprunts_chevauchants.empty?
  end
  
  # Récupère les clés disponibles pour une voiture
  def self.cles_disponibles_pour_voiture(voiture_id)
    Cle.where(voiture_id: voiture_id)
  end
  
  # Récupère l'image d'une voiture
  def self.get_voiture_image(voiture_id)
    voiture_folder = Rails.root.join('storage', 'vehicules', "vehicules_#{voiture_id}")
    
    # Vérifier si le dossier existe
    return nil unless Dir.exist?(voiture_folder)
    
    # Chercher la première image dans le dossier
    photo_path = Dir.glob("#{voiture_folder}/*").first
    
    # Vérifier si une image a été trouvée
    return nil unless photo_path && File.exist?(photo_path)
    
    # Lire et encoder l'image
    content = File.read(photo_path)
    content_type = case File.extname(photo_path).downcase
                  when '.jpg', '.jpeg'
                    'image/jpeg'
                  when '.png'
                    'image/png'
                  else
                    'application/octet-stream'
                  end
                  
    return {
      image_data: Base64.encode64(content),
      content_type: content_type
    }
  end
end 