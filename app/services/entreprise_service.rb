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
    entreprise = Entreprise.find_by(id: enterprise_id)
    return { success: false, message: "Entreprise non trouvée" } unless entreprise
    
    if entreprise.code_entreprise == code
      { success: true }
    else
      { success: false, message: "Code entreprise invalide" }
    end
  end

  def self.get_entreprise_with_sites(enterprise_id)
    entreprise = Entreprise.find_by(id: enterprise_id)
    return { success: false, message: "Entreprise non trouvée" } unless entreprise

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
      pays: entreprise.pays
    }
  end
end 