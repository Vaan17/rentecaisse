class EntrepriseService
  def self.get_all_entreprises
    Entreprise.all.map do |entreprise|
      {
        id: entreprise.id,
        nom: entreprise.nom_entreprise,
        code: entreprise.code_entreprise
      }
    end
  end

  def self.verify_enterprise_code(enterprise_id, code)
    # Gestion du cas où l'entreprise n'existe pas
    entreprise = Entreprise.find_by(id: enterprise_id)
    return { success: false, message: "Entreprise non trouvée. Veuillez contacter votre administrateur." } unless entreprise
    
    # Validation du code entreprise
    if entreprise.code_entreprise == code
      { success: true }
    else
      { success: false, message: "Le code saisi n'est pas correct. Veuillez vérifier et réessayer." }
    end
  end

  def self.get_entreprise_with_sites(enterprise_id)
    entreprise = Entreprise.find_by(id: enterprise_id)
    return { success: false, message: "Entreprise non trouvée. Veuillez contacter votre administrateur." } unless entreprise

    sites = SiteService.get_sites_by_enterprise(enterprise_id)
    
    {
      success: true,
      entreprise: {
        id: entreprise.id,
        nom: entreprise.nom_entreprise,
        sites: sites
      }
    }
  end

  def self.get_entreprise_details(enterprise_id)
    entreprise = Entreprise.find_by(id: enterprise_id)
    return nil unless entreprise

    {
      nom: entreprise.nom_entreprise,
      adresse: entreprise.adresse,
      ville: entreprise.ville,
      code_postal: entreprise.code_postal,
      pays: entreprise.pays,
      image: get_entreprise_image(entreprise)
    }
  end

  # Récupération de l'image de l'entreprise en base64
  def self.get_entreprise_image(entreprise)
    return "/images/placeholders/entreprise-placeholder.svg" if entreprise.lien_image_entreprise.blank?

    image_path = Rails.root.join('storage', 'entreprises', "entreprise_#{entreprise.id}", entreprise.lien_image_entreprise)
    
    if File.exist?(image_path)
      begin
        image_data = File.read(image_path)
        extension = File.extname(entreprise.lien_image_entreprise).downcase.gsub('.', '')
        
        # Détermination du type MIME
        mime_type = case extension
                   when 'jpg', 'jpeg'
                     'image/jpeg'
                   when 'png'
                     'image/png'
                   when 'gif'
                     'image/gif'
                   else
                     'image/jpeg'
                   end

        base64_image = Base64.strict_encode64(image_data)
        "data:#{mime_type};base64,#{base64_image}"
      rescue StandardError => e
        Rails.logger.error "Erreur lors de la lecture de l'image de l'entreprise #{entreprise.id}: #{e.message}"
        "/images/placeholders/entreprise-placeholder.svg"
      end
    else
      Rails.logger.warn "Image non trouvée pour l'entreprise #{entreprise.id}: #{image_path}"
      "/images/placeholders/entreprise-placeholder.svg"
    end
  end
end 