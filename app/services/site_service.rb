class SiteService
  def self.get_sites_by_enterprise(enterprise_id)
    Site.where(entreprise_id: enterprise_id).map do |site|
      {
        id: site.id,
        nom: site.nom_site,
        adresse: site.adresse
      }
    end
  end

  def self.get_site_details(site_id)
    site = Site.find_by(id: site_id)
    return { success: false, message: "Site non trouvé" } unless site

    {
      success: true,
      site: {
        id: site.id,
        nom: site.nom_site,
        adresse: site.adresse,
        entreprise_id: site.entreprise_id
      }
    }
  end
end 